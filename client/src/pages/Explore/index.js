import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { handleSearchUserByTextAPI } from "../../services";

export default function Explore() {
    const [inputText, setInputText] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (inputText === '') {
                setResults([])
            } else {
                const users = await handleSearchUserByTextAPI(inputText);
                setResults(users.data.results);
            }
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
        <div
            style={{
                padding: 30
            }}
        >
            <h1>Search User:</h1>
            <div className="search">
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    onChange={(e) => {
                        var lowerCase = e.target.value.toLowerCase();
                        setInputText(lowerCase);
                    }}
                    label="Search"
                    sx={{
                        width: "100%",
                        input: {
                            color: 'white',
                        },
                        label : {
                            color: "gray",
                            fontStyle: "italic"
                        }
                    }}
                />
            </div>
            <ul>
                <List />
            </ul>
        </div>
    )
} 
