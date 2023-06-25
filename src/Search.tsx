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
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #333342;
  @media (max-width: 700px) {
    width: 100%;
  }
`;

const Title = styled.h1`
  color: #163a54;
  font-size: 22px;
  font-family: Montserrat, sans-serif;
`;

const InputBlock = styled.input`
  border-radius: 10px;
  border: 1px solid rgba(19, 30, 38, 0.33);
  background: rgba(255, 255, 255, 0.5);
  width: 76%;
  color: #131e26;
  font-size: 18px;
  font-family: Chalkboard, sans-serif;
  padding: 20px 10px;
  text-align: center;
`;

const SearchButton = styled.div`
  border-radius: 10px;
  border: 1px solid #cfb9ff;
  background: #333342;
  width: 80%;
  padding: 20px 10px;
  box-sizing: border-box;
  color: #fff;
  font-size: 18px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  cursor: pointer;
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
        <Container>
            <WhiteBox>
                <Title>Athlete Lookup</Title>
                <form style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "10px"}}>
                    <label>Enter the Athlete's Address</label>
                    <InputBlock value={address} onChange={(e) => setAddress(e.target.value)} placeholder={"Address/ENS"}></InputBlock>
                    <SearchButton onClick={submitHandler}>Search</SearchButton>
                </form>
            </WhiteBox>
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
    )
}

export default Search