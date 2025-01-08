'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Item {
  itemName: string
  quantity: number
  photo: string
}

interface AddProps {
  onAdd: (item: Item) => void
}

export default function Add({ onAdd }: AddProps) {
  const [item, setItem] = useState<Item>({ itemName: '', quantity: 0 ,photo: ''})

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem((prevItem) => ({
      ...prevItem,
      itemName: e.target.value
    }))
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem((prevItem) => ({
      ...prevItem,
      quantity: Number(e.target.value)
    }))
  }

  const handleAdd = () => {
    onAdd(item)
    setItem({ itemName: '', quantity: 0 ,photo: '' })
  }

  return (
    <div className="space-y-4">
      <Input
      type="text"
      placeholder="Add the item"
      value={item.itemName}
      onChange={handleItemChange}
      />
      <Input
      type="number"
      placeholder="Enter quantity"
      value={item.quantity}
      onChange={handleQuantityChange}
      />
      <Input
      type="text"
      placeholder="Add photo URL"
      value={item.photo}
      onChange={(e) => setItem((prevItem) => ({
        ...prevItem,
        photo: e.target.value
      }))}
      />
      <Button className="bg-lightPink-400 text-white px-4 py-2 rounded-md hover:bg-lightPink-600 transition" onClick={handleAdd}>Add</Button>
    </div>
  )
}