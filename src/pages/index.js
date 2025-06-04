import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import style from "../style/Home.module.css"; 

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [entered, setEntered] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState("");

  // Lecture du localStorage au chargement
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
      setEntered(true);
      // Vérifier si l'utilisateur est déjà dans une room
      fetch(`/api/user?name=${encodeURIComponent(storedName)}`)
        .then(res => res.json())
        .then(user => {
          if (user && user[0].roomId) {
            // Redirige vers la première room trouvée
            router.push(`/${user[0].roomId}`);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (!entered) return;
    setLoading(true);
    fetch("/api/room")
      .then((res) => res.json())
      .then((data) => {
        const roomsWithMembers = (data || []).map(room => ({
          ...room,
          members: room.users ? room.users.length : 0,
        }));
        setRooms(roomsWithMembers);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [entered]);

  const handleEnter = async (e) => {
    e.preventDefault();
    if (name.trim()) {
      // Vérifie si l'utilisateur existe déjà
      const userRes = await fetch(`/api/user?name=${encodeURIComponent(name)}`);
      if (userRes.ok) {
        const user = await userRes.json();
        if (user && user.name) {
          setEntered(true);
          localStorage.setItem("name", name);
          return;
        }
      }
      // Sinon, crée le user
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setEntered(true);
        localStorage.setItem("name", name);
      } else {
        alert("Erreur lors de la création du profil.");
      }
    }
  };

  const handleCreateRoom = async () => {
    if (!name) return;
    try {
      const res = await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: name }),
      });
      if (res.ok) {
        const room = await res.json();
        router.push(`/${room.id}`);
      } else {
        alert("Erreur lors de la création de la room.");
      }
    } catch (e) {
      alert("Erreur lors de la création de la room.");
    }
  };

  const handleJoinRoom = async (roomId) => {
    if (!roomId || !name) {
      alert("Veuillez entrer votre nom et le code de la room.");
      return;
    }
    try {
      // Vérifie que la room existe
      const roomRes = await fetch(`/api/room/${roomId}`);
      if (!roomRes.ok) {
        alert("Cette room n'existe pas.");
        return;
      }
      // Associe l'utilisateur à la room
      const userRes = await fetch(`/api/user/${encodeURIComponent(name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId }),
      });
      if (userRes.ok) {
        router.push(`/${roomId}`);
      } else {
        alert("Impossible de rejoindre la room.");
      }
    } catch (e) {
      alert("Erreur lors de la connexion à la room.");
    }
  };

  const handleLogout = async () => {
    if (!name) return;
    try {
      await fetch(`/api/user/${encodeURIComponent(name)}`, { method: 'DELETE' });
      localStorage.removeItem("name");
      setName("");
      setEntered(false);
    } catch (e) {
      alert("Erreur lors de la déconnexion.");
    }
  };

  if (!entered) {
    return (
      <div className={style.container}>
        <h2>Bienvenue !</h2>
        <form onSubmit={handleEnter} className={style.form}>
          <label>
            Entrez votre nom :
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={style.input}
            />
          </label>
          <button type="submit" className={style.button}>
            Valider
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <h2>Bonjour, {name} !</h2>
      <button onClick={handleLogout} className={style.button}>
        Se déconnecter
      </button>
      <div className={style.actions}>
        <button onClick={handleCreateRoom} className={style.button}>
          Créer une room
        </button>
        <input
          type="text"
          placeholder="Nom de la room"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className={style.input}
        />
        <button onClick={() => handleJoinRoom(roomName)} className={style.button}>
          Rejoindre une room
        </button>
      </div>
      <h3>Rooms existantes :</h3>
      <div className={style.roomListContainer}>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <ul className={style.roomList}>
            {[...rooms]
              .sort((a, b) => b.members - a.members)
              .map((room) => (
                <li key={room.id} className={style.roomItem}>
                  <span className={style.roomMembers}>
                    {room.members}
                  </span>
                  <span className={style.roomName}>
                    {room.name}
                  </span>
                  <span className={style.roomCode}>
                    {room.id}
                  </span>
                  <span className={style.roomJoinBtn}>
                    <button
                      className={`${style.button} ${style.join}`}
                      onClick={() => handleJoinRoom(room.id)}
                    >
                      Rejoindre
                    </button>
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}