
import React, { useState, useEffect } from "react"
import axios from "axios"
import './darkMode.css';
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
//import './decks.css';
import { Modal, Form } from 'react-bootstrap';
import "./App.css";


function Decks() {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDeck, setEditDeck] = useState(null);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light'
  );
      const toggleTheme = () => {
      if (theme === 'light') {
      setTheme('dark');
      } else {
    setTheme('light');
      }
      };
      useEffect(() => {
        localStorage.setItem('theme', theme);
        document.body.className = theme;
      }, [theme]);
  useEffect(() => {
    async function fetchData() {
      try {
        const authToken = localStorage.getItem("authToken");
        const headers = {
            Authorization: `Bearer ${authToken}`,
          };
          const response = await axios.get("http://localhost:3002/decks", { headers });
       // localStorage.setItem("decks", JSON.stringify(data.decks))
        setDecks(response.data.decks)
        // toast("uspešna prijava", {
        //     position: toast.POSITION.BOTTOM_RIGHT,
        //   });

      } catch (err) {
        toast(err.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
        navigate("/login")
      }
    }
    fetchData();
  }, [navigate]);


  const handleDelete = async (deckId) => {
    // Delete the selected deck from the server
    try {
        const authToken = localStorage.getItem("authToken");
        const headers = {
            Authorization: `Bearer ${authToken}`,
          };
      await axios.delete(`http://localhost:3002/decks/${deckId}`, { headers });
      // Update the decks state to remove the deleted deck
      setDecks(decks.filter(deck => deck._id !== deckId));
     // ipcRenderer.send('deck-deleted-notification');
      toast("uspešno izbrisan deck", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast("ne uspešno izbrisan deck", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      console.error(error);
    }
  };


  const handleEdit = (deckId) => {
    // Find the deck that needs to be edited and set it in the state
    const deckToEdit = decks.find(deck => deck._id === deckId);
    setEditDeck(deckToEdit);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    // Reset the edit deck state and close the modal
    setEditDeck(null);
    setShowEditModal(false);
  };
  
  const handleEditDeck = async (event) => {
    // Prevent the form from submitting and reload the page
    event.preventDefault();

    // Send a PUT request to update the deck on the server
    try {
        const authToken = localStorage.getItem("authToken");
        const headers = {
            Authorization: `Bearer ${authToken}`,
          };
      await axios.put(`http://localhost:3002/decks/${editDeck._id}`, { name: event.target.name.value }, { headers });
      // Update the decks state to reflect the updated deck
      const updatedDecks = decks.map(deck => {
        if (deck._id === editDeck._id) {
          return { ...deck, name: event.target.name.value };
        } else {
          return deck;
        }
      });
      setDecks(updatedDecks);
      toast("uspešno posodobljen deck", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

   async function handleCreateDeck(event) {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");
    const headers = {
        Authorization: `Bearer ${authToken}`,
      };
      try {
        const result = await axios.post(
          "http://localhost:3002/decks",
          { name: newDeckName },
          { headers }
        );
        setDecks([...decks, result.data]);
        setNewDeckName("");
        setShowAddDeck(false);
        toast("uspešno dodan deck", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } catch (err) {
        console.error(err);
        toast("napaka pri dodajanju decka", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    }


  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      const result = await axios.get(
        `http://localhost:3002/decks/search?q=${searchQuery}`
      );
      setDecks(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <>
    <div>
    <div className={`App ${theme}`}>
    <Button onClick={toggleTheme}>Toggle Theme</Button>
     <ToastContainer />
    <div style={{ display: "flex", flexWrap: "wrap" }}>
    {decks.map(deck => (
      <Card key={deck._id} className="card">
        <Card.Body>
          <Card.Title  >{deck.name}</Card.Title>
          <Button variant="danger" onClick={() => handleDelete(deck._id)}>Delete</Button>
          <Button variant="warning" onClick={() => handleEdit(deck._id)}>Edit</Button>
        </Card.Body>
      </Card>
    ))}
    
    

 <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Deck</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditDeck}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" defaultValue={editDeck ? editDeck.name : ''} />
            </Form.Group>
            <Button variant="primary" type="submit">Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    <div>
      {!showAddDeck && (
        <Button onClick={() => setShowAddDeck(true)}>Add Deck</Button>
      )}
      {showAddDeck && (
        <Modal show={showAddDeck} onHide={() => setShowAddDeck(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Create Deck</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateDeck}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter deck name" value={newDeckName} onChange={(event) => setNewDeckName(event.target.value)} />
              </Form.Group>
              <Button variant="primary" type="submit">Create</Button>
              <Button variant="secondary" onClick={() => setShowAddDeck(false)}>Cancel</Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </div>

<div className="form-container">
  <Form onSubmit={handleSearch}>
    <Form.Control
      type="text"
      placeholder="Search deck by name"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
    />
    <Button type="submit">Search</Button>
  </Form>
</div>
<Button className="logout-btn" variant="primary"  onClick={handleLogout}>Logout</Button>
</div>
  </div>
  </>
  );
}

export default Decks; 

