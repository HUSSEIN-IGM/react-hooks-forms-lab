import React, { useState } from "react";
import ShoppingList from "./ShoppingList";
import ItemForm from "./ItemForm";
import Filter from "./Filter";
import itemData from "../data/items";
import { v4 as uuid } from "uuid";

function App() {
  const [items, setItems] = useState(itemData);
  const [search, setSearch] = useState("");

  function handleAddItem(newItem) {
    setItems([...items, newItem]);
  }

  function handleSearchChange(searchText) {
    setSearch(searchText);
  }

  const itemsToDisplay = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="App">
      <ItemForm onItemFormSubmit={handleAddItem} />
      <Filter search={search} onSearchChange={handleSearchChange} />
      <ShoppingList items={itemsToDisplay} />
    </div>
  );
}

export default App;
