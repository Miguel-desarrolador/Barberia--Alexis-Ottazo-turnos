// Importa solo lo necesario
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDXw018OhuAsPA3HJW85z86jK7rJC3BUmQ",
  authDomain: "barberia-alexis-ottazo.firebaseapp.com",
  projectId: "barberia-alexis-ottazo",
  storageBucket: "barberia-alexis-ottazo.appspot.com",
  messagingSenderId: "747699261711",
  appId: "1:747699261711:web:0576d00f4bc9dc5853ae7a",
  measurementId: "G-M3663Z55G3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Colección de reservas
const reservasCollection = collection(db, "reservas");

// ==========================
// FUNCIONES FIRESTORE
// ==========================

// Guardar reserva
export async function guardarReserva(hora, nombre, telefono) {
  try {
    await setDoc(doc(reservasCollection, hora), {
      nombre,
      telefono,
      hora
    });
    console.log(`✅ Reserva guardada: ${hora} - ${nombre}`);
  } catch (error) {
    console.error("❌ Error guardando reserva:", error);
  }
}

// Eliminar reserva
export async function eliminarReserva(hora) {
  try {
    await deleteDoc(doc(reservasCollection, hora));
    console.log(`🗑️ Reserva eliminada: ${hora}`);
  } catch (error) {
    console.error("❌ Error eliminando reserva:", error);
  }
}

// Obtener todas las reservas
export async function obtenerReservas() {
  try {
    const snapshot = await getDocs(reservasCollection);
    const reservasData = {};
    snapshot.forEach(docSnap => {
      reservasData[docSnap.id] = docSnap.data();
    });
    return reservasData;
  } catch (error) {
    console.error("❌ Error obteniendo reservas:", error);
    return {};
  }
}

// Exporta db por si quieres usarlo directamente
export { db };
