import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from "styled-components/macro"
import Modal from "react-modal";
import './Tracking.css'
import toast, { Toaster } from 'react-hot-toast';
import { request } from 'graphql-request'
import TransactionList from './TransactionList'
const AWS = require('aws-sdk');


Modal.setAppElement("#root");


function Tracking() {
    // State for Modal
    const [isOpen, setIsOpen] = useState(false);
    // State for Tx Filters
    const [txFilter, setTxFilter] = useState('all')
    // Array of Addresses to Track
    const [address, setAddress] = useState('')
    const [addressesToTrack, setAddressesToTrack] = useState([])
    // State for Note
    const [note, setNote] = useState('')
    // State for Transactions Array
    const [txns, setTxns] = useState([])

// Fetch addresseToTrack from API
useEffect(() => {
    axios.get('https://pesnn3wxa9.execute-api.us-east-1.amazonaws.com/api/addresses')
    .then(res => {
      // For each object in res.data get address and notes properties and add to an array
      const addresses = res.data.Items.map(obj => obj.Address)
      const notes = res.data.Items.map(obj => obj.note)
      // Set addresses array to state
      setAddressesToTrack(addresses)
      console.log(res.data)
      console.log(addresses)
      console.log(notes)
    })
    .catch(err => {
      console.log(err)
    })
  }, []);

  const addAddressToTrack = (event) => {

    const addressAndNote = {
        Address: address,
        Note: note
    }
    const addressesAndNotes = addressesToTrack.map((address, index) => ({
        Address: address,
              Note: note[index]
            }));
    console.log('addressandNote object is ' + addressAndNote)
    // Add Address to Track to DynamoDb
    axios
    .post(
      "https://pesnn3wxa9.execute-api.us-east-1.amazonaws.com/api/addresses",
      addressAndNote
    )
    .then((res) => {
      console.log(res);
      toast.success("Address Added!");
      setAddressesToTrack((prevState) => {
        return [...prevState, addressAndNote];
      });
    })
    .catch((err) => {
      console.log(err);
    });
  }
  

    function toggleModal() {
        setIsOpen(!isOpen);
    }

    // Set Tx Filters
    const setFilter = (e) => {
        const value = e.target.value;
        setTxFilter(value);
    }

    function deleteAddress(address) {
        const newAddressesToTrack = addressesToTrack.filter(add => add !== address);
        setAddressesToTrack(newAddressesToTrack);
      }      

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
                                        <div className="App">
                                            <button onClick={toggleModal}>+ Global Filters</button>
                                            <Modal
                                                isOpen={isOpen}
                                                onRequestClose={toggleModal}
                                                contentLabel="My dialog"
                                                style={{
                                                    overlay: {
                                                      position: 'fixed',
                                                      top: 0,
                                                      left: 0,
                                                      right: 0,
                                                      bottom: 0,
                                                      backgroundColor: 'rgba(255, 255, 255, 0.75)'
                                                    },
                                                    content: {
                                                      position: 'absolute',
                                                      top: '8rem',
                                                      left: '40px',
                                                      right: '40px',
                                                      bottom: '40px',
                                                      border: '1px solid #ccc',
                                                      background: '#fff',
                                                      overflow: 'auto',
                                                      WebkitOverflowScrolling: 'touch',
                                                      borderRadius: '4px',
                                                      outline: 'none',
                                                      padding: '20px'
                                                    }
                                                  }}
                                                >
                                                    <div>
                                                        tx.value <input type="text" onChange={setFilter} value={txFilter.value}></input><br/> <p>{txFilter.value}</p> 
                                                        tx.to <input type="text" onChange={setFilter} value={txFilter.to}></input><br/>
                                                        tx.from <input type="text" onChange={setFilter} value={txFilter.from}></input>
                                                    </div>
                                                    <button>Apply</button>
                                                    <button onClick={toggleModal}>Close</button>
                                                </Modal>
                                        </div>
                                    </GlobalFiltersUITopContentModal>
                                </GlobalFiltersUITopContent1>
                                    <p>Status: Pending Transactions</p>
                            </GlobalFiltersUITopContent>
                        </GlobalFiltersUITop>
                    </GlobalFiltersUIMain>
                    <AddressTracker>
                    <SubscriptionContainer>
                        <Toaster />
                        <label for="address">Address</label>
                        <AddressInput 
                            value={address} 
                            type="text" 
                            id="address" 
                            name="address" 
                            placeholder="0x..." 
                            onChange={(event) => setAddress(event.target.value)}>
                        </AddressInput>
                        <label for="note">Note</label>
                        <NoteInput
                            value={note}
                            type="text"
                            id="note"
                            name="note"
                            placeholder=" Note: Ex. Uniswap Address"
                            onChange={(event) => setNote(event.target.value)}>
                        </NoteInput>
                        {/* Verify the address is a valid ethereum address */}
                        <button onClick={() => {
                            const pattern = new RegExp("^0x[a-fA-F0-9]{40}$");
                            console.log(pattern.test(address))
                            console.log(address)
                            if (pattern.test(address)) {
                                addAddressToTrack(address && note)
                            } else {
                                toast.error("Address is not valid!")
                                return
                            }
                        }}
                        >Add Address</button>
                        

                        {addressesToTrack.map((addressAndNote, index) => (
  <SubscribedAddressContainer key={index}>
    <AddressTitle>{addressAndNote.Address}</AddressTitle>
    <Notes>{addressAndNote.Note}</Notes>
    <DeleteAddressButton 
      onClick={() => deleteAddress(addressAndNote.Address)}
    >
      X
    </DeleteAddressButton>
  </SubscribedAddressContainer>
))}
                    </SubscriptionContainer>
                    </AddressTracker>
                </GlobalFiltersInner>
            </GlobalFiltersOuter>
            <UserInputContainer>
                <UserInput>
                </UserInput>
            </UserInputContainer>
        </UserInterface>
        <Output>
        {txns.slice(-15).map((txn, index) => (
            <TxnWrapper key={index}>
                {/* {JSON.stringify(txn)} */}
                <p>Hash: <HashText>{JSON.stringify(txn.hash)}</HashText></p>
                <InnerWrapper>
                    <p>Nonce: {JSON.stringify(txn.nonce)}</p>
                    <p>From: {JSON.stringify(txn.from)}</p>
                    <p>To: {JSON.stringify(txn.to)}</p>
                    <p>Value: <ValueText>{JSON.stringify(txn.value)}</ValueText></p>
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

const HashText = styled.span`
    color: green;
`

const InnerWrapper = styled.div`
    p {
        margin-left: 1rem;
    }
`

const ValueText = styled.span`
    color: red;
`

const UserInputContainer = styled.div`
    width: 50vw;
`

const UserInput = styled.form`
    margin-left: 1rem;
`

const AddressInput = styled.input`
    margin-left: .5rem;
`

const NoteInput = styled.input`
    margin-left: .5rem;
`

const SubscribedAddressContainer = styled.div`
    width: 100%;
    height: 2.3rem;
    margin: .5rem 0 0 0;
    outline: 1px solid black;
    border-radius: 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: flex-start;
    align-items: flex-end;
`

const AddressTitle = styled.p`
    margin: .32rem 0 0 1.3rem;
    text-align: center;
    font-size: .75rem;
`

const Notes = styled.p`
    margin: 0 0 0 1.3rem;
    text-size: .5rem;
    text-align: center;
`

const DeleteAddressButton = styled.button`
    text-size: .5rem;
    border-radius: 25px;
    background-color: red;
    color: white;
    align-self: flex-end;
    text-align: center;
    display: flex;
    margin: .2rem .5rem 0 0;
`

export default Tracking