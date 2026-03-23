import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Navbar from "../component/navbar";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [viewingNote, setViewingNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  // --- 1. ดึงข้อมูล (READ) ---
  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const currentUserId = localStorage.getItem("userId");
      const userIdInt = parseInt(currentUserId, 10);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes?userId=${userIdInt}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      const result = await response.json();

      if (response.ok) {
        setNotes(result.items || []);
      }
    } catch (error) {
      console.error("Fetch Notes Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. สร้างโน้ต (CREATE) ---
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const currentUserId = localStorage.getItem("userId");
      const userIdInt = parseInt(currentUserId, 10);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title: newNote.title,
            content: newNote.content,
            user_id: userIdInt,
          }),
        },
      );

      if (response.ok) {
        setIsModalOpen(false);
        setNewNote({ title: "", content: "" });
        fetchNotes();
      }
    } catch (error) {
      console.error("Create Note Error:", error);
    }
  };

  // --- 3. ลบโน้ต (DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบโน้ตนี้ใช่หรือไม่?")) return;
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (response.ok) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // --- 4. แก้ไขโน้ต (UPDATE) ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${editingNote.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            title: editingNote.title,
            content: editingNote.content,
          }),
        },
      );

      if (response.ok) {
        setEditingNote(null);
        fetchNotes();
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#E2E2E2] to-[#142845]">
        <div className="w-16 h-16 border-4 border-[#FFC800]/30 border-t-[#FFC800] rounded-full animate-spin"></div>
        <p className="mt-4 text-[#FFC800] font-bold text-xl animate-pulse">
          Loading your notes...
        </p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[30px] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#494949] mb-6">
              Create New Note
            </h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-4 bg-[#F5F5F5] rounded-xl outline-none"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Content"
                rows="5"
                className="w-full p-4 bg-[#F5F5F5] rounded-xl outline-none resize-none"
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                required
              />
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 p-3 text-[#494949] font-semibold rounded-full hover:bg-red-600 hover:text-[#F5F5F5] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 bg-yellow-500 text-[#142845] rounded-full font-bold hover:bg-[#FFC800] hover:text-[#142845] transition-all cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[30px] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#494949] mb-6">
              Edit Note
            </h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="w-full p-4 bg-[#F5F5F5] rounded-xl outline-none"
                value={editingNote.title}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Content"
                rows="5"
                className="w-full p-4 bg-[#F5F5F5] rounded-xl outline-none resize-none"
                value={editingNote.content}
                onChange={(e) =>
                  setEditingNote({ ...editingNote, content: e.target.value })
                }
                required
              />
              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="flex-1 p-3 text-[#494949] font-semibold rounded-full hover:bg-red-600 hover:text-[#F5F5F5] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 p-3 bg-yellow-500 text-[#142845] rounded-full font-bold hover:bg-[#FFC800] hover:text-[#142845] transition-all cursor-pointer"
                >
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingNote && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white w-full max-w-2xl rounded-[30px] p-10 relative shadow-2xl">
            <button
              onClick={() => setViewingNote(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black text-2xl"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold text-[#494949] mb-4">
              {viewingNote.title}
            </h2>
            <hr className="mb-6 opacity-20" />
            <div className="text-lg text-[#494949]/80 leading-relaxed max-h-[60vh] overflow-y-auto">
              {viewingNote.content}
            </div>
          </div>
        </div>
      )}

      <div className="w-screen h-screen bg-gradient-to-t from-[#E2E2E2] to-[#142845]">
        <div className="w-screen h-screen p-4 md:p-12 bg-gradient-to-t from-[#E2E2E2] to-[#142845] flex justify-center animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="w-full max-w-7xl bg-[#E2E2E2] rounded-[74px] flex flex-col gap-6 md:gap-10 px-6 py-8 md:px-[100px] md:py-[70px] translate-y-10 animate-[slideUp_0.5s_ease-out_forwards]">
            <h1 className="text-2xl md:text-4xl font-bold text-[#494949]">
              My notes
            </h1>
            <hr className="border-t border-[#494949]/20 w-full" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 overflow-y-auto">
              <div
                onClick={() => setIsModalOpen(true)}
                className="aspect-square max-w-[300px] flex items-center justify-center border-4 border-dashed border-[#494949]/30 rounded-[30px] cursor-pointer hover:bg-black/5 transition-all"
              >
                <span className="text-4xl text-[#494949]">+</span>
              </div>

              {notes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setViewingNote(note)}
                  className="w-full max-w-[300px] min-h-[250px] flex flex-col gap-4 p-6 bg-white rounded-[30px] shadow-sm cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#494949] truncate">
                      {note.title}
                    </h2>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingNote(note);
                        }}
                        className="text-[#494949] hover:text-black transition-colors cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5 21h14c1.1 0 2-.9 2-2v-8h-2v8H5V5h8V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2"
                          />
                          <path
                            fill="currentColor"
                            d="M7 14v2c0 .55.45 1 1 1h2c.27 0 .52-.11.71-.29l7.65-7.65l-3.41-3.41L7.3 13.3a1 1 0 0 0-.29.71Zm13.71-7.29a.996.996 0 0 0 0-1.41l-2-2a.996.996 0 0 0-1.41 0l-1.65 1.65l3.41 3.41z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(note.id);
                        }}
                        className="text-[#494949] hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <hr className="border-t border-[#494949]/20 w-full" />

                  <p className="text-sm md:text-base text-[#494949]/70 line-clamp-6 leading-relaxed">
                    {note.content}
                  </p>

                  <div className="mt-auto pt-2 text-[10px] text-gray-400">
                    Created:{" "}
                    {new Date(note.created).toLocaleDateString("th-TH")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
