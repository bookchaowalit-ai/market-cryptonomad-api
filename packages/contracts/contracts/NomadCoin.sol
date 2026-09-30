// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title NomadCoin
 * @dev Enhanced ERC-20 token with minting, burning, pausing, and role-based access control
 * @notice This contract implements the Nomad Coin token with advanced features
 */
contract NomadCoin is 
    Initializable,
    ERC20Upgradeable,
    ERC20PermitUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // Role definitions
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Token constants
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens

    // Blacklist mapping for compliance
    mapping(address => bool) public blacklisted;

    // Events
    event TokensMinted(address indexed to, uint256 amount, address indexed minter);
    event TokensBurned(address indexed from, uint256 amount);
    event AddressBlacklisted(address indexed account, address indexed admin);
    event AddressUnblacklisted(address indexed account, address indexed admin);
    event MaxSupplyUpdated(uint256 oldMaxSupply, uint256 newMaxSupply);

    // Custom errors
    error InsufficientBalance(uint256 requested, uint256 available);
    error ExceedsMaxSupply(uint256 requested, uint256 maxSupply);
    error BlacklistedAddress(address account);
    error UnauthorizedMinter(address account);
    error UnauthorizedPauser(address account);
    error UnauthorizedUpgrader(address account);
    error InvalidAmount(uint256 amount);
    error ZeroAddress();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Initializes the contract with token details and roles
     * @param name Token name
     * @param symbol Token symbol
     * @param admin Address to receive admin role
     * @param minters Array of addresses to receive minter role
     * @param pausers Array of addresses to receive pauser role
     */
    function initialize(
        string memory name,
        string memory symbol,
        address admin,
        address[] memory minters,
        address[] memory pausers
    ) public initializer {
        if (admin == address(0)) revert ZeroAddress();

        __ERC20_init(name, symbol);
        __ERC20Permit_init(name);
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        // Grant admin role
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPGRADER_ROLE, admin);

        // Grant minter roles
        for (uint256 i = 0; i < minters.length; i++) {
            if (minters[i] != address(0)) {
                _grantRole(MINTER_ROLE, minters[i]);
            }
        }

        // Grant pauser roles
        for (uint256 i = 0; i < pausers.length; i++) {
            if (pausers[i] != address(0)) {
                _grantRole(PAUSER_ROLE, pausers[i]);
            }
        }
    }

    /**
     * @dev Mints tokens to specified address
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) whenNotPaused {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0) revert InvalidAmount(amount);
        if (blacklisted[to]) revert BlacklistedAddress(to);
        
        uint256 newTotalSupply = totalSupply() + amount;
        if (newTotalSupply > MAX_SUPPLY) {
            revert ExceedsMaxSupply(newTotalSupply, MAX_SUPPLY);
        }

        _mint(to, amount);
        emit TokensMinted(to, amount, _msgSender());
    }

    /**
     * @dev Burns tokens from caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external whenNotPaused {
        if (amount == 0) revert InvalidAmount(amount);
        if (balanceOf(_msgSender()) < amount) {
            revert InsufficientBalance(amount, balanceOf(_msgSender()));
        }

        _burn(_msgSender(), amount);
        emit TokensBurned(_msgSender(), amount);
    }

    /**
     * @dev Burns tokens from specified address (requires allowance)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external whenNotPaused {
        if (from == address(0)) revert ZeroAddress();
        if (amount == 0) revert InvalidAmount(amount);
        if (balanceOf(from) < amount) {
            revert InsufficientBalance(amount, balanceOf(from));
        }

        _spendAllowance(from, _msgSender(), amount);
        _burn(from, amount);
        emit TokensBurned(from, amount);
    }

    /**
     * @dev Pauses all token transfers
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /**
     * @dev Adds address to blacklist
     * @param account Address to blacklist
     */
    function blacklistAddress(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (account == address(0)) revert ZeroAddress();
        blacklisted[account] = true;
        emit AddressBlacklisted(account, _msgSender());
    }

    /**
     * @dev Removes address from blacklist
     * @param account Address to remove from blacklist
     */
    function unblacklistAddress(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (account == address(0)) revert ZeroAddress();
        blacklisted[account] = false;
        emit AddressUnblacklisted(account, _msgSender());
    }

    /**
     * @dev Grants minter role to address
     * @param account Address to grant minter role
     */
    function grantMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (account == address(0)) revert ZeroAddress();
        _grantRole(MINTER_ROLE, account);
    }

    /**
     * @dev Revokes minter role from address
     * @param account Address to revoke minter role
     */
    function revokeMinterRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, account);
    }

    /**
     * @dev Grants pauser role to address
     * @param account Address to grant pauser role
     */
    function grantPauserRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (account == address(0)) revert ZeroAddress();
        _grantRole(PAUSER_ROLE, account);
    }

    /**
     * @dev Revokes pauser role from address
     * @param account Address to revoke pauser role
     */
    function revokePauserRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(PAUSER_ROLE, account);
    }

    /**
     * @dev Returns the maximum supply of tokens
     */
    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }

    /**
     * @dev Checks if address has minter role
     * @param account Address to check
     */
    function isMinter(address account) external view returns (bool) {
        return hasRole(MINTER_ROLE, account);
    }

    /**
     * @dev Checks if address has pauser role
     * @param account Address to check
     */
    function isPauser(address account) external view returns (bool) {
        return hasRole(PAUSER_ROLE, account);
    }

    /**
     * @dev Checks if address is blacklisted
     * @param account Address to check
     */
    function isBlacklisted(address account) external view returns (bool) {
        return blacklisted[account];
    }

    // Internal functions

    /**
     * @dev Hook that is called before any transfer of tokens
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        if (blacklisted[from]) revert BlacklistedAddress(from);
        if (blacklisted[to]) revert BlacklistedAddress(to);
        super._beforeTokenTransfer(from, to, amount);
    }

    /**
     * @dev Authorizes contract upgrades
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {
        // Additional upgrade logic can be added here
    }

    /**
     * @dev Returns the version of the contract
     */
    function version() external pure returns (string memory) {
        return "1.0.0";
    }

    // The following functions are overrides required by Solidity

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}