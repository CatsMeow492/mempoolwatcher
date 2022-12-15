import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Form, Input, List, Tooltip, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import styled from "styled-components/macro"
import './Tracking.css'
import toast, { Toaster } from 'react-hot-toast';

const mockTxns = [
  {
    blockHash: null,
    blockNumber: null,
    from: '0x38CF69984b90C31C0672781AA47c33CA9b66E2Af',
    gas: 135229,
    gasPrice: '14639254009',
    hash: '0x47a8a3b2a4c9fee30f1bb2a3b40ad53f7eadcbf3c183a6dfbbda2e32f1dbae0f',
    input: '0x095ea7b30000000000000000000000003fdbd4ed52dca2a3f3deae50b828da448c6107f5ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    nonce: 45,
    to: '0x90e188bc18a4A99bC17277Ab512F7462915c1582',
    transactionIndex: null,
    value: '0',
    type: 0,
    chainId: '0x5',
    v: '0x2d',
    r: '0xecdd376471bf9da650f372cc49d6e880d28f36842ab5ad554c52dfa57604975d',
    s: '0x79c20b72f8de7072f5ec2e5537c14a8876b909639e3e03ffe39727c7c2855af9'
  },
  {
    blockHash: null,
    blockNumber: null,
    from: '0x38CF69984b90C31C0672781AA47c33CA9b66E2Af',
    gas: 135229,
    gasPrice: '14639254009',
    hash: '0x47a8a3b2a4c9fee30f1bb2a3b40ad53f7eadcbf3c183a6dfbbda2e32f1dbae0f',
    input: '0x095ea7b30000000000000000000000003fdbd4ed52dca2a3f3deae50b828da448c6107f5ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    nonce: 45,
    to: '0x90e188bc18a4A99bC17277Ab512F7462915c1582',
    transactionIndex: null,
    value: '0',
    type: 0,
    chainId: '0x5',
    v: '0x2d',
    r: '0xecdd376471bf9da650f372cc49d6e880d28f36842ab5ad554c52dfa57604975d',
    s: '0x79c20b72f8de7072f5ec2e5537c14a8876b909639e3e03ffe39727c7c2855af9'
  },
  {
    blockHash: null,
    blockNumber: null,
    from: '0x929f4bB05Bdb68ee71d9A33e334278EE263FcB43',
    gas: 137017,
    gasPrice: '14639254009',
    hash: '0xaaef5ba3f3100f65a4bd126f9902f24b739f028b6de1bbcb622cf788f25958fe',
    input: '0x095ea7b3000000000000000000000000e76b0df1cd138b5c5abfeac51c3edacf8dd79fb5ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    nonce: 42,
    to: '0x90e188bc18a4A99bC17277Ab512F7462915c1582',
    transactionIndex: null,
    value: '0',
    type: 0,
    chainId: '0x5',
    v: '0x2e',
    r: '0xfb9fbfbb3f71e611361cdc4937129811fbd85bda9ed23500ec792ebae24fe2c5',
    s: '0x2f7f1e13ce16f357c15ebdb7ffca94e5f52c9f4ec0a732a983ee1711833c166e'
  },
  {
    blockHash: null,
    blockNumber: null,
    from: '0x75A634bD27e41dE0c556555479Cba95eFCC39f16',
    gas: 21632,
    gasPrice: '20351254443',
    maxFeePerGas: '20351254443',
    maxPriorityFeePerGas: '1500000000',
    hash: '0xe775338c079b80a906186ed42a4378e96334eae73ef2bac08c5633f9466b419a',
    input: '0x095ea7b3000000000000000000000000a0b5cbdc4d14c4f4d36483ec0de310919f3b2d9000000000000000000000000000000000000000000000000029a2241af62c0000',
    nonce: 4,
    to: '0x000080383847bD75F91c168269Aa74004877592f',
    transactionIndex: null,
    value: '0',
    type: 2,
    accessList: [],
    chainId: '0x5',
    v: '0x1',
    r: '0x6564b7e718324ecf542e7ecee9dc966e11aebfe6071a67427f5c1918ef83b814',
    s: '0x46b974a6c43b7126b64083ee012430807b77774ffeb59e6d2c7cc37d0b447458'
  },
  {
    blockHash: null,
    blockNumber: null,
    from: '0x1B03463FE6793961c3a24cC98bC835909A3aAC95',
    gas: 153535,
    gasPrice: '28205526940',
    maxFeePerGas: '28205526940',
    maxPriorityFeePerGas: '1000000000',
    hash: '0x65a0aeb230695a4707683a0dc11c9871ca6a0f734f66889f439fc4b7e0a23be1',
    input: '0xa0712d680000000000000000000000000000000000000000000000000000000000000001',
    nonce: 38,
    to: '0xd706B27C9f0D14D32209e560140130aD10FC7Aa8',
    transactionIndex: null,
    value: '0',
    type: 2,
    accessList: [],
    chainId: '0x5',
    v: '0x1',
    r: '0x39a68e0b39b4b76cdf88f30f0a556d9060c3c677a9ab0598623a1b3fc8523a3d',
    s: '0xbd3ef1f643290c1c143d8d0a8a9d811937eaeb6ff72d60b62f15fc80d4e62f'
  }
]

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
    const newAddressesToTrack = addressesToTrack.filter(add => add !== address);
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