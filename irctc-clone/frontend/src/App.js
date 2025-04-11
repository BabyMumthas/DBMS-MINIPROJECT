import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// ✅ Correct file paths based on folder structure
import Layout from "./files/layout";  
import Login from "./files/login";
import Homepage from "./files/homepage";
import AdminLogin from "./files/adminLogin";
import AdminView from "./files/adminview";
import UserView from "./files/UserView";
import Bookaticket from "./files/bookaticket";
import Bookticket from "./files/Bookticket";
import BookForm from "./files/BookForm";
import Trainsearch from "./files/components/trainsearch";  
import Dashboard from "./files/components/Dashboard";
import TrainList from "./files/TrainList";
import AddTrain from "./files/addtrain";
import Register from './files/register';

const isAuthenticated = localStorage.getItem("authToken");

function App() {
  return (
    <Routes>
       <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Homepage />} />
        <Route path="login" element={<Login />} />
        <Route path="admin-login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminView />} />
        <Route path="dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="book-ticket" element={isAuthenticated ? <Bookaticket /> : <Navigate to="/" />} />
        <Route path="search-train" element={<Trainsearch />} />
        <Route path="user" element={<UserView />} />
        <Route path="search" element={<Bookticket />} />
        <Route path="book" element={<BookForm />} />
        <Route path="add-train" element={<AddTrain />} />
        <Route path="train-list" element={<TrainList />} />
      </Route>
    </Routes>
  );
}

export default App;
