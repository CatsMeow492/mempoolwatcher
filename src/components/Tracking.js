import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, Input, List, Tooltip, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import styled from "styled-components/macro"
import './Tracking.css'
import toast, { Toaster } from 'react-hot-toast';
import TransactionList from './TransactionList'

const mockTxns = []

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
  const [txns, setTxns] = useState(mockTxns)

  // Fetch transactions from API
  const fetchData = () => {
    try {
      axios.get("http://localhost:3001/transactions-data").then((res) => {
        setTxns((prevState) => {
          return [...prevState, res.data];
        });
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch addresseToTrack from API
  useEffect(() => {
    axios.get('https://pesnn3wxa9.execute-api.us-east-1.amazonaws.com/api/addresses')
      .then(res => {
        // For each object in res.data get address and notes properties and add to an array
        const addresses = res.data.Items.map(obj => ({
          Address: obj.Address,
          Note: ''
        }))
        const notes = res.data.Items.map(obj => obj.Note)
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
    const newAddressesToTrack = addressesToTrack.filter(add => add.Address !== address);
    setAddressesToTrack(newAddressesToTrack);
  }

  return (
    <Body>
      <UserInterface>
        <FilterWrapper>
          <Button type="primary" onClick={toggleModal}>+ Global Filters</Button>
          <Modal title="Global Filters" cancelText="Close" okText="Apply" open={isOpen} onOk={() => { }} onCancel={toggleModal}>
            <ModalBody>
              <Form
                layout={'vertical'}
              >
                <Form.Item label="tx.value">
                  <Input value={txFilter.value} onChange={setFilter} />
                </Form.Item>
                <Form.Item label="tx.to">
                  <Input value={txFilter.to} onChange={setFilter} />
                </Form.Item>
                <Form.Item label="tx.from">
                  <Input value={txFilter.from} onChange={setFilter} />
                </Form.Item>
              </Form>
            </ModalBody>
          </Modal>
        </FilterWrapper>

        <AddFormWrapper>
          <Toaster />
          <Form
            layout={'inline'}
          >
            <Form.Item label="Address">
              <Input placeholder="0x..." id="address"
                name="address" value={address} onChange={(event) => setAddress(event.target.value)} />
            </Form.Item>
            <Form.Item label="Note">
              <Input placeholder="Note: Ex. Uniswap Address" id="note"
                name="note" value={note} onChange={(event) => setNote(event.target.value)} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={() => {
                const pattern = new RegExp("^0x[a-fA-F0-9]{40}$");
                console.log(pattern.test(address))
                console.log(address)
                if (pattern.test(address)) {
                  addAddressToTrack(address && note)
                } else {
                  toast.error("Address is not valid!")
                  return
                }
              }}>Add Address</Button>
            </Form.Item>
          </Form>
        </AddFormWrapper>

        <div>
          <List
            className="demo-loadmore-list"
            itemLayout="horizontal"
            dataSource={addressesToTrack}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Tooltip title="Remove Address">
                    <Button onClick={() => deleteAddress(item.Address)} danger ghost type="primary" size="small" shape="circle" icon={<DeleteOutlined />} />
                  </Tooltip>
                ]}
              >
                <List.Item.Meta
                  title={item.Address}
                  description={item.Note}
                />
              </List.Item>
            )}
          />
        </div>
      </UserInterface>
      <Output>
      {setInterval(() => {
         fetchData();
        }, 1000)}
        {txns.slice(-15).map((txn, index) => (
          <TxnWrapper key={index}>
            {/* {JSON.stringify(txn)} */}
            <p>Hash: <HashText>{JSON.stringify(txn.hash)}</HashText></p>
            <InnerWrapper>
              <p>Nonce: {JSON.stringify(txn.nonce)}</p>
              <p>From: {JSON.stringify(txn.from)}</p>
              <p>To: {JSON.stringify(txn.to)}</p>
              <LastValue>Value: <ValueText>{JSON.stringify(txn.value)}</ValueText></LastValue>
            </InnerWrapper>
          </TxnWrapper>
        ))}
      </Output>
    </Body>
  )
}

const Body = styled.div`
  display: flex;
  justify-content: space-between;
  height: calc(100vh - 160px);
`

const UserInterface = styled.div`
    transition: width 250ms ease-in-out;
    width: 49.5%;
    height: 100%;
    display: inline-block;
    background-color: white;
    border-radius: 25px;
    padding: 24px;
    overflow: auto;
`

const FilterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`

const AddFormWrapper = styled.div`
  margin-bottom: 16px;
`

const Output = styled.div`
    background-color: black;
    width: 49.5%;
    min-height: 100%;
    overflow: auto;
    border-radius: 25px;
    padding: 24px;
    p {
        color: #A464D5;
    }
`

const TxnWrapper = styled.div`
    marin: 10px;
    padding-left: 1rem;
    border: 1px dashed white;
    border-radius: 10px;
    padding: 8px;
    margin: 8px;
`

const HashText = styled.span`
    color: green;
`

const InnerWrapper = styled.div`
    p {
        margin-left: 1rem;
    }
`

const LastValue = styled.p`
  margin-bottom: 0
`

const ValueText = styled.span`
    color: red;
`

const ModalBody = styled.div`
 margin: 32px 0;
`

export default Tracking