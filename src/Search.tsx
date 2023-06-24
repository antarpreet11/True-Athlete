import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import GradientBar from "./components/GradientBar";
import { useAccount } from "wagmi";
import {
  getAttestationsForAddress,
  getConfirmationAttestationsForUIDs,
  getENSNames,
} from "./utils/utils";
import { ResolvedAttestation } from "./utils/types";
import { AttestationItem } from "./AttestationItem";

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const AttestationHolder = styled.div``;

const NewConnection = styled.div`
  color: #333342;
  text-align: center;
  font-size: 25px;
  font-family: Montserrat, sans-serif;
  font-style: italic;
  font-weight: 700;
  margin-top: 20px;
`;

const WhiteBox = styled.div`
  box-shadow: 0 4px 33px rgba(168, 198, 207, 0.15);
  background-color: #fff;
  padding: 20px;
  width: 590px;
  border-radius: 10px;
  margin: 40px auto 0;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const Search = () => {

    const [address, setAddress] = useState("");
    const [attestations, setAttestations] = useState<ResolvedAttestation[]>([]);

    const submitHandler = async (e: any) => {
        e.preventDefault();

        const tmpAttestations = await getAttestationsForAddress(address);
        const addresses = new Set<string>();

        tmpAttestations.forEach((att) => {
            addresses.add(att.attester);
            addresses.add(att.recipient);
        });

        let resolvedAttestations: ResolvedAttestation[] = [];

        tmpAttestations.forEach((att) => {
            resolvedAttestations.push({
              ...att,
              name: att.attester,
            });
        });
        setAttestations(resolvedAttestations);
    }
    
    return (
        <div>
            <form>
                <label>Enter the Athelete's Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)}></input>
                <button type="submit" onClick={submitHandler}>Search</button>
            </form>
            <Container>
                <GradientBar />
                <NewConnection>{address}</NewConnection>
                <AttestationHolder>
                    <WhiteBox>
                    {attestations.map((attestation, i) => (
                        <AttestationItem key={i} data={attestation} />
                    ))}
                    </WhiteBox>
                </AttestationHolder>
            </Container>
        </div>
    )
}

export default Search