import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from "styled-components/macro"


function Tracking() {

    const [ txns, setTxns ] = useState([]) // array of transactions fetched from the backend

    const fetchData = () => {
        try {
            axios.get('http://localhost:3001/transactions-data').then(res => {
                setTxns(prevState => {
                    return [...prevState, res.data]
                })
            })
        } catch(e) {
            console.log(e)
        }
    }


    useEffect(() => {
       setInterval(() => {
            fetchData()
       }, [1000])
    }, [])

  return (
    <Body>
        <UserInterface>
            <GlobalFiltersOuter>
                <GlobalFiltersInner>
                    <GlobalFiltersUIMain>
                        <GlobalFiltersUITop>
                            <GlobalFiltersUITopContent>
                                <GlobalFiltersUITopContent1>
                                    <h4>Global Filters</h4>
                                    <GlobalFiltersUITopContentModal>
                                        + Global Filter
                                    </GlobalFiltersUITopContentModal>
                                </GlobalFiltersUITopContent1>
                                    <p>Status: Pending Transactions</p>
                            </GlobalFiltersUITopContent>
                        </GlobalFiltersUITop>
                    </GlobalFiltersUIMain>
                </GlobalFiltersInner>
            </GlobalFiltersOuter>
            <AddressTracker>
                <SubscriptionContainer>

                </SubscriptionContainer>
            </AddressTracker>
        </UserInterface>
        <Output>
        {txns.slice(-15).map((txn, index) => (
            <TxnWrapper key={index}>
                {/* {JSON.stringify(txn)} */}
                <p>Hash: <OutputText>{JSON.stringify(txn.hash)}</OutputText></p>
                <InnerWrapper>
                    <p>Nonce: {JSON.stringify(txn.nonce)}</p>
                    <p>From: {JSON.stringify(txn.from)}</p>
                    <p>To: {JSON.stringify(txn.to)}</p>
                </InnerWrapper>
            </TxnWrapper>
        ))}
        </Output>
    </Body>
  )
}

const Body = styled.div`
    overflow: hidden;
    flex: 1;
    height: 100vh;
    width: 100vw;
    padding-top: 70px;
    display: flex;
`

const UserInterface = styled.div`
    transition: width 250ms ease-in-out;
    width: 50vw;
    height: 100%;
    display: inline-block;
`

const GlobalFiltersOuter = styled.div`
    width: 50vw;
    height: 100%;
`

const GlobalFiltersInner = styled.div`
    padding: 0.5rem;
    margin: 0.1rem;
    border-radius: 25px;
    height: 100%;
    background-color: lightgray;
`

const AddressTracker = styled.div`

`

const SubscriptionContainer = styled.div`

`

const GlobalFiltersUIMain = styled.div`
    padding-left: 0.5rem;
    padding-right: 0.5rem;
`

const GlobalFiltersUITop = styled.div`
    padding-bottom: 1rem;
`

const GlobalFiltersUITopContent = styled.div`
    color: #1a1d26;
`

const GlobalFiltersUITopContent1 = styled.div`
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const GlobalFiltersUITopContentModal = styled.div`
    margin-top: 1rem;
`

const Output = styled.div`
    background-color: black;
    width: 50vw;
    height: 100%;
    overflow: auto;
    border-radius: 25px;
    p {
        color: #A464D5;
    }
`

const TxnWrapper = styled.div`
    marin: 10px;
    padding-left: 1rem;
`

const OutputText = styled.span`
    color: green;
`

const InnerWrapper = styled.div`
    p {
        margin-left: 1rem;
    }
`

export default Tracking