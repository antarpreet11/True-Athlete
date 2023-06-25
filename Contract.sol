// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import {IEAS, Attestation} from "ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import {SchemaResolver} from "ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";
import {Ownable} from "openzeppelin/openzeppelin-contracts/contracts/access/Ownable.sol";
import {Address} from "openzeppelin/openzeppelin-contracts/contracts/utils/Address.sol";

contract Vault is SchemaResolver {
    using Address for address payable;
    mapping(address => bool) public whitelist;

    constructor(IEAS eas, address[] memory wl) SchemaResolver(eas) {
        for (uint i = 0; i < wl.length; i++) {
            whitelist[wl[i]] = true;
        }
    }

    function isPayable() public pure override returns (bool) {
        return true;
    }

    receive() external payable override {}

    function onAttest(
        Attestation calldata attestation,
        uint256 amount
    ) internal override returns (bool) {
        require(!attestation.revocable);
        if (amount != 0) {
            return true;
        }
        if (!whitelist[msg.sender]) {
            return false;
        }
        uint256 sendAmount = sliceUint(attestation.data, 0);
        require(address(this).balance >= sendAmount, "SendAmount too high.");
        (bool sent, bytes memory data) = payable(attestation.recipient).call{
            value: sendAmount
        }("");
        require(sent, "Failed to send.");

        return true;
    }

    function onRevoke(
        Attestation calldata,
        uint256
    ) internal pure override returns (bool) {
        return false;
    }

    function sliceUint(
        bytes memory bs,
        uint start
    ) internal pure returns (uint) {
        require(bs.length >= start + 32, "Slicing out of range.");
        uint x;
        assembly {
            x := mload(add(bs, add(0x20, start)))
        }
        return x;
    }
}
