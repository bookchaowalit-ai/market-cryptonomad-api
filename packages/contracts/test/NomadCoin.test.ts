import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

const MAX_SUPPLY = ethers.parseEther("1000000000");

async function deployFixture() {
  const [admin, minter, pauser, alice, bob, outsider] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory("NomadCoin");
  const token: any = await upgrades.deployProxy(
    Factory,
    ["Nomad Coin", "NOMAD", admin.address, [minter.address], [pauser.address]],
    { initializer: "initialize", kind: "uups" }
  );
  await token.waitForDeployment();
  return { token, Factory, admin, minter, pauser, alice, bob, outsider };
}

describe("NomadCoin", () => {
  describe("initialization", () => {
    it("sets metadata and roles", async () => {
      const { token, admin, minter, pauser } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("Nomad Coin");
      expect(await token.symbol()).to.equal("NOMAD");
      expect(await token.totalSupply()).to.equal(0n);
      expect(await token.maxSupply()).to.equal(MAX_SUPPLY);
      expect(await token.hasRole(await token.DEFAULT_ADMIN_ROLE(), admin.address)).to.equal(true);
      expect(await token.hasRole(await token.UPGRADER_ROLE(), admin.address)).to.equal(true);
      expect(await token.isMinter(minter.address)).to.equal(true);
      expect(await token.isPauser(pauser.address)).to.equal(true);
      expect(await token.isMinter(admin.address)).to.equal(false);
    });

    it("cannot be initialized twice", async () => {
      const { token, admin } = await loadFixture(deployFixture);
      await expect(token.initialize("X", "X", admin.address, [], [])).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });

    it("rejects a zero admin", async () => {
      const Factory = await ethers.getContractFactory("NomadCoin");
      await expect(
        upgrades.deployProxy(Factory, ["N", "N", ethers.ZeroAddress, [], []], { kind: "uups" })
      ).to.be.reverted;
    });

    it("locks the bare implementation against initialization", async () => {
      const { Factory, admin } = await loadFixture(deployFixture);
      const impl: any = await Factory.deploy();
      await expect(impl.initialize("N", "N", admin.address, [], [])).to.be.revertedWith(
        "Initializable: contract is already initialized"
      );
    });
  });

  describe("minting", () => {
    it("lets a minter mint and emits TokensMinted", async () => {
      const { token, minter, alice } = await loadFixture(deployFixture);
      await expect(token.connect(minter).mint(alice.address, 100n))
        .to.emit(token, "TokensMinted")
        .withArgs(alice.address, 100n, minter.address);
      expect(await token.balanceOf(alice.address)).to.equal(100n);
    });

    it("rejects non-minters", async () => {
      const { token, outsider, alice } = await loadFixture(deployFixture);
      await expect(token.connect(outsider).mint(alice.address, 1n)).to.be.revertedWith(/missing role/);
    });

    it("rejects zero amount and zero address", async () => {
      const { token, minter, alice } = await loadFixture(deployFixture);
      await expect(token.connect(minter).mint(alice.address, 0n))
        .to.be.revertedWithCustomError(token, "InvalidAmount")
        .withArgs(0n);
      await expect(token.connect(minter).mint(ethers.ZeroAddress, 1n)).to.be.revertedWithCustomError(
        token,
        "ZeroAddress"
      );
    });

    it("enforces the hard max supply exactly at the boundary", async () => {
      const { token, minter, alice } = await loadFixture(deployFixture);
      await token.connect(minter).mint(alice.address, MAX_SUPPLY - 1n);
      await token.connect(minter).mint(alice.address, 1n);
      expect(await token.totalSupply()).to.equal(MAX_SUPPLY);
      await expect(token.connect(minter).mint(alice.address, 1n))
        .to.be.revertedWithCustomError(token, "ExceedsMaxSupply")
        .withArgs(MAX_SUPPLY + 1n, MAX_SUPPLY);
    });

    it("stops a revoked minter", async () => {
      const { token, admin, minter, alice } = await loadFixture(deployFixture);
      await token.connect(admin).revokeMinterRole(minter.address);
      await expect(token.connect(minter).mint(alice.address, 1n)).to.be.revertedWith(/missing role/);
    });
  });

  describe("burning", () => {
    it("burns own balance and rejects over-burn", async () => {
      const { token, minter, alice } = await loadFixture(deployFixture);
      await token.connect(minter).mint(alice.address, 50n);
      await expect(token.connect(alice).burn(20n)).to.emit(token, "TokensBurned").withArgs(alice.address, 20n);
      expect(await token.totalSupply()).to.equal(30n);
      await expect(token.connect(alice).burn(31n))
        .to.be.revertedWithCustomError(token, "InsufficientBalance")
        .withArgs(31n, 30n);
    });

    it("burnFrom requires allowance", async () => {
      const { token, minter, alice, bob } = await loadFixture(deployFixture);
      await token.connect(minter).mint(alice.address, 50n);
      await expect(token.connect(bob).burnFrom(alice.address, 10n)).to.be.revertedWith(
        "ERC20: insufficient allowance"
      );
      await token.connect(alice).approve(bob.address, 10n);
      await token.connect(bob).burnFrom(alice.address, 10n);
      expect(await token.balanceOf(alice.address)).to.equal(40n);
      expect(await token.allowance(alice.address, bob.address)).to.equal(0n);
    });

    it("burning frees supply under the cap", async () => {
      const { token, minter, alice } = await loadFixture(deployFixture);
      await token.connect(minter).mint(alice.address, MAX_SUPPLY);
      await token.connect(alice).burn(5n);
      await token.connect(minter).mint(alice.address, 5n);
      expect(await token.totalSupply()).to.equal(MAX_SUPPLY);
    });
  });

  describe("pausing", () => {
    it("blocks transfers, mints and burns while paused", async () => {
      const { token, minter, pauser, alice, bob } = await loadFixture(deployFixture);
      await token.connect(minter).mint(alice.address, 10n);
      await token.connect(pauser).pause();
      await expect(token.connect(alice).transfer(bob.address, 1n)).to.be.revertedWith("Pausable: paused");
      await expect(token.connect(minter).mint(alice.address, 1n)).to.be.revertedWith("Pausable: paused");
      await expect(token.connect(alice).burn(1n)).to.be.revertedWith("Pausable: paused");
      await token.connect(pauser).unpause();
      await token.connect(alice).transfer(bob.address, 1n);
      expect(await token.balanceOf(bob.address)).to.equal(1n);
    });

    it("only pausers can pause", async () => {
      const { token, admin } = await loadFixture(deployFixture);
      await expect(token.connect(admin).pause()).to.be.revertedWith(/missing role/);
    });
  });

  describe("blacklist", () => {
    it("blocks sending, receiving and minting for blacklisted accounts", async () => {
      const { token, admin, minter, alice, bob } = await loadFixture(deployFixture);
      await token.connect(minter).mint(alice.address, 10n);
      await token.connect(admin).blacklistAddress(bob.address);
      expect(await token.isBlacklisted(bob.address)).to.equal(true);

      await expect(token.connect(alice).transfer(bob.address, 1n))
        .to.be.revertedWithCustomError(token, "BlacklistedAddress")
        .withArgs(bob.address);
      await expect(token.connect(minter).mint(bob.address, 1n))
        .to.be.revertedWithCustomError(token, "BlacklistedAddress")
        .withArgs(bob.address);

      await token.connect(admin).blacklistAddress(alice.address);
      await expect(token.connect(alice).transfer(admin.address, 1n))
        .to.be.revertedWithCustomError(token, "BlacklistedAddress")
        .withArgs(alice.address);

      await token.connect(admin).unblacklistAddress(alice.address);
      await token.connect(alice).transfer(admin.address, 1n);
      expect(await token.balanceOf(admin.address)).to.equal(1n);
    });

    it("blocks transferFrom by an allowed spender on behalf of a blacklisted owner", async () => {
      const { token, admin, minter, alice, bob } = await loadFixture(deployFixture);
      await token.connect(minter).mint(alice.address, 10n);
      await token.connect(alice).approve(bob.address, 10n);
      await token.connect(admin).blacklistAddress(alice.address);
      await expect(token.connect(bob).transferFrom(alice.address, bob.address, 1n))
        .to.be.revertedWithCustomError(token, "BlacklistedAddress")
        .withArgs(alice.address);
    });

    it("only admins manage the blacklist", async () => {
      const { token, outsider, alice } = await loadFixture(deployFixture);
      await expect(token.connect(outsider).blacklistAddress(alice.address)).to.be.revertedWith(/missing role/);
      await expect(
        (await loadFixture(deployFixture)).token.blacklistAddress(ethers.ZeroAddress)
      ).to.be.revertedWithCustomError(token, "ZeroAddress");
    });
  });

  describe("upgrades", () => {
    it("rejects upgrades from accounts without UPGRADER_ROLE", async () => {
      const { token, Factory, outsider, minter } = await loadFixture(deployFixture);
      const newImpl = await Factory.deploy();
      for (const signer of [outsider, minter]) {
        await expect(token.connect(signer).upgradeTo(await newImpl.getAddress())).to.be.revertedWith(
          /missing role/
        );
      }
    });

    it("lets the upgrader upgrade while preserving balances", async () => {
      const { token, Factory, admin, minter, alice } = await loadFixture(deployFixture);
      await token.connect(minter).mint(alice.address, 42n);
      const proxy = await token.getAddress();
      const upgraded: any = await upgrades.upgradeProxy(proxy, Factory.connect(admin), { kind: "uups" });
      expect(await upgraded.balanceOf(alice.address)).to.equal(42n);
      expect(await upgraded.version()).to.equal("1.0.0");
    });
  });
});
