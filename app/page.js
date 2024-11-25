"use client";
import { useState, useEffect } from 'react';
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Chat from "./components/Chat";
import { fetchInterests, fetchFeed, postInterest, deleteInterest } from './utils/api';


export default function Home() {
    const [interests, setInterests] = useState([]);
    const [feed, setFeed] = useState([]);

    useEffect(() => {
        async function loadInterests() {
            try {
                const data = await fetchInterests();
                setInterests(data);
            } catch (error) {
                console.error('Error loading interests:', error);
            }
        }
        loadInterests();
    }, []);

    useEffect(() => {
        async function loadFeed() {
            try {
                const data = await fetchFeed();
                setFeed(data);
            } catch (error) {
                console.error('Error loading feed:', error);
            }
        }
        loadFeed();
    }, [interests]);

    function addInterest(interest) {
        setInterests([...interests, interest]);
        postInterest(interest).catch(error => {
            console.error('Error posting interest:', error);
            // Optionally rollback the state change on error
            setInterests(interests);
        });
    }

    function removeInterest(interest) {
        setInterests(interests.filter(i => i !== interest));
        deleteInterest(interest).catch(error => {
            console.error('Error deleting interest:', error);
            // Optionally rollback the state change on error
            setInterests([...interests, interest]);
        });
    }

    return (
        <div>
            <NavBar />
            <div class="flex h-[calc(100vh-3rem)]">
                <SideBar 
                    interests={interests} 
                    addInterest={addInterest} 
                    removeInterest={removeInterest} 
                />
                <Chat feed={feed} />
            </div>
      </div>

    )
}
