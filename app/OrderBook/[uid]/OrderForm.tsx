/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField
} from '@mui/material'
import moment from 'moment'

type OrderType = 'Buy' | 'Sell'
type TradeType = 'Dollars' | 'Shares'

export interface OrderFormData {
  symbol: string
  type: OrderType
  tradeType: TradeType
  price: number
  quantity: number
  goodUntilCanceled: boolean
  expirationDate: Date
  uid?: string
}

interface OrderFormProps {
  isShowing: boolean
  onClose: () => void
  onSubmit: (formData: OrderFormData) => void
}

const initialFormData: OrderFormData = {
  symbol: 'APPL',
  type: 'Buy',
  tradeType: 'Dollars',
  price: 0,
  quantity: 0,
  goodUntilCanceled: false,
  expirationDate: new Date()
}

const OrderForm: React.FC<OrderFormProps> = ({ isShowing, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(initialFormData)

  const handleFormSubmit = () => {
    onSubmit(formData)
    setFormData(initialFormData)
    onClose()
  }

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    const newValue = name === 'expirationDate' ? moment.utc(value).local().toDate() : value
    console.log(newValue, value)
    setFormData((prevData) => ({ ...prevData, [name]: newValue }))
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target
    const newValue = name === 'goodUntilCanceled' ? checked : value
    console.log(name, newValue)
    setFormData((prevData) => ({ ...prevData, [name]: newValue }))
  }
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value.replace(/[^0-9.]/g, '').replace(/^0+/, '')
    if (/^\d+(\.\d{0,2})?$/.test(newValue)) {
      const { name } = event.target
      console.log(name, newValue)
      setFormData((prevData) => ({ ...prevData, [name]: newValue }))
    }
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      type: event.target.value as OrderType
    }))
  }
  const handleTradeTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      tradeType: event.target.value as TradeType
    }))
  }
  return (
    <Dialog open={isShowing} onClose={onClose}>
      <DialogTitle>New Order</DialogTitle>
      <DialogContent>
        <DialogContentText>Enter the order details:</DialogContentText>
        <TextField
          label={'Stock'}
          type='text'
          value={formData.symbol}
          onChange={(e) => { setFormData({ ...formData, symbol: e.target.value }) }}
          fullWidth
        />
        <FormLabel>Side</FormLabel>
        <RadioGroup
            aria-label="orderType"
            name="orderType"
            value={formData.type}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              value="Buy"
              control={<Radio />}
              label="Buy"
            />
            <FormControlLabel
              value="Sell"
              control={<Radio />}
              label="Sell"
            />
          </RadioGroup>
          <FormControl component="fieldset">
          <FormLabel>Amount</FormLabel>
          <RadioGroup
            aria-label="tradeType"
            name="tradeType"
            value={formData.tradeType}
            onChange={handleTradeTypeChange}
          >
            <FormControlLabel
              value="Dollars"
              control={<Radio />}
              label="Dollars"
            />
            <FormControlLabel
              value="Shares"
              control={<Radio />}
              label="Shares"
            />
          </RadioGroup>
        </FormControl>
        {(() => {
          if (formData.tradeType === 'Shares') {
            return (
              <TextField
              margin="dense"
              id="quantity"
              name="quantity"
              label="quantity per Share"
              type="number"
              InputProps={{
                inputProps: {
                  min: 1,
                  step: 1,
                  onKeyUp: (e: any) => {
                    const value: number = e.target?.value ?? 0
                    e.target.value = Number(value.toString())
                  }
                },
                startAdornment: <InputAdornment position="start">#</InputAdornment>
              }}
              value={formData.quantity}
              onChange={handleInputChange}
              fullWidth
              required
              error={!/^\d+$/.test(formData.quantity.toString())}
              helperText={
                !/^\d+$/.test(formData.quantity.toString()) &&
                'Please enter a valid integer'
              }
            />
            )
          } else {
            return (
              <TextField
              margin="dense"
              id="price"
              name="price"
              label="Price per Share"
              type="number"
              value={formData.price}
              onChange={handlePriceChange}
              fullWidth
              required inputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                inputMode: 'numeric',
                pattern: '[0-9]*',
                inputProps: {
                  min: 0.01,
                  step: 0.01
                }
              }}
            />
            )
          }
        })()}

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.goodUntilCanceled}
              onChange={handleInputChange}
              name="goodUntilCanceled"
              color="primary"
            />
          }
          label="Good Until Canceled"
        />
        <TextField
          disabled={formData.goodUntilCanceled}
          margin="dense"
          id="expirationDate"
          label="Expiration date"
          type="datetime-local"
          value={formData.expirationDate.toISOString().substring(0, 16)}
          onChange={handleDateChange}
          name="expirationDate"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleFormSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default OrderForm
