
import "../FREX.sol";

/**
 * @dev Extension of {FREX} that adds a cap to the supply of tokens.
 */
abstract contract FREXCapped is FREX {
    uint256 private immutable _cap;

    /**
     * @dev Sets the value of the `cap`. This value is immutable, it can only be
     * set once during construction.
     */
    constructor(uint256 cap_) {
        require(cap_ > 0, "FREXCapped: cap is 0");
        _cap = cap_;
    }

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    /**
     * @dev See {FREX-_mint}.
     */
    function _mint(address account, uint256 amount) internal virtual override {
        require(
            FREX.totalSupply() + amount <= cap(),
            "FREXCapped: cap exceeded"
        );
        super._mint(account, amount);
    }
}
