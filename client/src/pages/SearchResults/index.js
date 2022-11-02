import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { handleSearchUserAPI } from "../../services/app";

export default function SearchResults() {
    const [inputText, setInputText] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const users = await handleSearchUserAPI(inputText);
            setResults(users.data.results); 
        }
        fetchData();
    }, [inputText])

    function List() {
        if (!results || results.length === 0) {
            return (
                <p>No result</p>
            )
        }
        return (
            <>
                <div>Result number: {results.length}</div>
                <ul>
                    {results.map((item) => (
                        <li key={item.username}>
                            Username: <Link to={`/profile?username=${item.username}`} replace>
                                    {item.username}
                                </Link> 
                            . Email: <b>{item.email}</b>
                        </li>
                    ))}
                </ul>
            </>
        )
    }

    return (
        <div>
            <h1>Search User:</h1>
            <div className="search">
                <TextField
                id="outlined-basic"
                variant="outlined" 
                onChange={(e) => {
                    var lowerCase = e.target.value.toLowerCase();
                    setInputText(lowerCase);
                }}
                fullWidth
                label="Search"
                />
            </div>
            <ul>
                <List/>
            </ul>
        </div>
    )
} 
