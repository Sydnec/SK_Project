import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RoomPage() {
  const router = useRouter();
  const { roomId } = router.query;
  const [roomData, setRoomData] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Récupère le nom de l'utilisateur depuis le localStorage
    const storedName = localStorage.getItem('name');
    if (storedName) setUserName(storedName);
  }, []);

  useEffect(() => {
    if (roomId) {
      fetch(`/api/room/${roomId}`)
        .then((res) => res.json())
        .then((data) => setRoomData(data))
        .catch(() => setRoomData(null));
    }
  }, [roomId]);

  const handleLeaveRoom = async () => {
    if (!userName) return;
    // Retire l'utilisateur de la room
    await fetch(`/api/user/${encodeURIComponent(userName)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: null }),
    });

    // Vérifie si la room est vide
    const res = await fetch(`/api/room/${roomId}`);
    if (res.ok) {
      const data = await res.json();
      if (!data.users || data.users.length === 0) {
        // Supprime la room si plus personne
        await fetch(`/api/room/${roomId}`, { method: 'DELETE' });
      }
    }

    router.push('/');
  };

  if (!roomId) {
    return <div>Chargement...</div>;
  }

  if (!roomData) {
    return <div>Room introuvable ou chargement...</div>;
  }

  return (
    <div>
      <h1>Room : {roomId}</h1>
      <p>Nom de la room : {roomData.name}</p>
      <button onClick={handleLeaveRoom}>Quitter la room</button>
      <h2>Utilisateurs :</h2>
      <ul>
        {roomData.users && roomData.users.length > 0 ? (
          roomData.users.map((user) => <li key={user.name}>{user.name}</li>)
        ) : (
          <li>Aucun utilisateur</li>
        )}
      </ul>
    </div>
  );
}