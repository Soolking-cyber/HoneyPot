// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract HoneyPotBee is ERC721, ERC721Enumerable, AccessControl {
    using Strings for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant BEE_SUPPLY = 124;
    uint256 public constant BEAR_TOKEN_ID = 125;

    uint256 public beeMinted;
    bool public revealActivated;
    string private _baseTokenURI;
    string private _unrevealedURI;

    mapping(uint256 => bool) public isBeeToken;

    event BeeMinted(address indexed to, uint256 indexed tokenId);
    event BearGranted(address indexed to);
    event RevealActivated(string baseURI);

    constructor(string memory unrevealedURI) ERC721("HoneyPot Bee", "HNYBEE") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _unrevealedURI = unrevealedURI;
    }

    function mintBee(address to) external onlyRole(MINTER_ROLE) returns (uint256 tokenId) {
        require(beeMinted < BEE_SUPPLY, "All bees minted");
        tokenId = beeMinted + 1;
        beeMinted++;
        isBeeToken[tokenId] = true;
        _safeMint(to, tokenId);
        emit BeeMinted(to, tokenId);
    }

    function mintBear(address to) external onlyRole(MINTER_ROLE) {
        require(_ownerOf(BEAR_TOKEN_ID) == address(0), "Bear minted");
        _safeMint(to, BEAR_TOKEN_ID);
        emit BearGranted(to);
    }

    function setBaseURI(string calldata newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = newBaseURI;
    }

    function setUnrevealedURI(string calldata newUnrevealedURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!revealActivated, "Reveal locked");
        _unrevealedURI = newUnrevealedURI;
    }

    function activateReveal(string calldata baseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!revealActivated, "Reveal set");
        revealActivated = true;
        _baseTokenURI = baseURI;
        emit RevealActivated(baseURI);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        if (_ownerOf(tokenId) == address(0)) revert("Token missing");
        if (!revealActivated) {
            return _unrevealedURI;
        }
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString()));
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
