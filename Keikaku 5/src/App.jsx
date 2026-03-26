import { useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  users: "keikaku_users",
  board: "keikaku_board",
};

const mockUser = {
  id: "user-matheus",
  name: "Matheus",
  cpf: "12345678910",
  email: "xude@email.com",
  password: "123456",
};

const columns = [
  { id: "product-backlog", title: "Product Backlog" },
  { id: "sprint-backlog", title: "Sprint Backlog" },
  { id: "to-do", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

const initialBoard = {
  "product-backlog": [
    {
      id: "card-1",
      title: "Definir escopo do MVP",
      owner: "Matheus",
      dueDate: "2026-03-26",
      comments: "Priorizar fluxo de login e quadro.",
    },
  ],
  "sprint-backlog": [
    {
      id: "card-2",
      title: "Criar identidade visual do Keikaku",
      owner: "Matheus",
      dueDate: "2026-03-27",
      comments: "",
    },
  ],
  "to-do": [
    {
      id: "card-3",
      title: "Preparar apresentação",
      owner: "Equipe",
      dueDate: "2026-03-25",
      comments: "Separar telas principais.",
    },
  ],
  doing: [],
  done: [],
};

function getStoredUsers() {
  const saved = localStorage.getItem(STORAGE_KEYS.users);
  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([mockUser]));
  return [mockUser];
}

function getStoredBoard() {
  const saved = localStorage.getItem(STORAGE_KEYS.board);
  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(STORAGE_KEYS.board, JSON.stringify(initialBoard));
  return initialBoard;
}

function formatDate(dateString) {
  if (!dateString) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${dateString}T00:00:00`));
}

function isDueSoon(dateString) {
  if (!dateString) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(`${dateString}T00:00:00`);
  const diffInDays = Math.round((dueDate - today) / 86400000);

  return diffInDays === 0 || diffInDays === 1;
}

function buildAlerts(board) {
  return Object.entries(board).flatMap(([columnId, cards]) =>
    cards
      .filter((card) => isDueSoon(card.dueDate))
      .map((card) => ({
        id: `alert-${card.id}`,
        cardId: card.id,
        columnId,
        message: `Entrega próxima: "${card.title}" vence em ${formatDate(card.dueDate)}.`,
      })),
  );
}

function LoginScreen({ onLogin, onRegister, users }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    cpf: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("login");

  function handleLogin(event) {
    event.preventDefault();

    const matchedUser = users.find(
      (user) =>
        user.email.toLowerCase() === loginData.email.toLowerCase() &&
        user.password === loginData.password,
    );

    if (!matchedUser) {
      setError("Credenciais inválidas. Tente o usuário mockado ou faça um cadastro.");
      return;
    }

    setError("");
    onLogin(matchedUser);
  }

  function handleRegister(event) {
    event.preventDefault();

    const alreadyExists = users.some(
      (user) =>
        user.email.toLowerCase() === registerData.email.toLowerCase() || user.cpf === registerData.cpf,
    );

    if (alreadyExists) {
      setError("Já existe um usuário com este e-mail ou CPF.");
      return;
    }

    const newUser = {
      id: `user-${crypto.randomUUID()}`,
      ...registerData,
    };

    setError("");
    onRegister(newUser);
  }

  return (
    <main className="auth-layout">
      <section className="auth-panel hero-panel">
        <span className="brand-chip">Keikaku</span>
        <h1>Planejamento visual simples, moderno e pronto para apresentar.</h1>
        <p>
          Organize backlog, sprint e execução em um quadro Kanban com login mockado,
          cadastro local e alertas de entregas próximas.
        </p>
        <div className="mock-credentials">
          <strong>Acesso mockado</strong>
          <span>Nome: Matheus</span>
          <span>CPF: 12345678910</span>
          <span>E-mail: xude@email.com</span>
          <span>Senha: 123456</span>
        </div>
      </section>

      <section className="auth-panel form-panel">
        <div className="tabs">
          <button
            type="button"
            className={activeTab === "login" ? "tab active" : "tab"}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={activeTab === "register" ? "tab active" : "tab"}
            onClick={() => setActiveTab("register")}
          >
            Cadastro
          </button>
        </div>

        {activeTab === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              E-mail
              <input
                type="email"
                value={loginData.email}
                onChange={(event) =>
                  setLoginData((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={loginData.password}
                onChange={(event) =>
                  setLoginData((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="primary-button">
              Entrar
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <label>
              Nome
              <input
                type="text"
                value={registerData.name}
                onChange={(event) =>
                  setRegisterData((current) => ({ ...current, name: event.target.value }))
                }
                required
              />
            </label>
            <label>
              CPF
              <input
                type="text"
                inputMode="numeric"
                maxLength={11}
                value={registerData.cpf}
                onChange={(event) =>
                  setRegisterData((current) => ({ ...current, cpf: event.target.value.replace(/\D/g, "") }))
                }
                required
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={registerData.email}
                onChange={(event) =>
                  setRegisterData((current) => ({ ...current, email: event.target.value }))
                }
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={registerData.password}
                onChange={(event) =>
                  setRegisterData((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="primary-button">
              Criar conta
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

function AddCardForm({ availableCards, onCreate, onCopy, onClose }) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [comments, setComments] = useState("");
  const [copyCardId, setCopyCardId] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onCreate({ title, owner, dueDate, comments });
    onClose();
  }

  function handleCopy() {
    if (!copyCardId) return;
    onCopy(copyCardId);
    onClose();
  }

  return (
    <div className="add-card-panel">
      <form className="mini-form" onSubmit={handleSubmit}>
        <label>
          Tarefa
          <input value={title} onChange={(event) => setTitle(event.target.value)} required />
        </label>
        <label>
          Responsável
          <input value={owner} onChange={(event) => setOwner(event.target.value)} required />
        </label>
        <label>
          Entrega
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
        </label>
        <label>
          Comentários
          <textarea
            rows="3"
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            placeholder="Opcional"
          />
        </label>
        <div className="mini-actions">
          <button type="submit" className="primary-button small-button">
            Adicionar
          </button>
          <button type="button" className="ghost-button small-button" onClick={onClose}>
            Fechar
          </button>
        </div>
      </form>

      <div className="copy-card-area">
        <p>Copiar card de outra coluna</p>
        <select value={copyCardId} onChange={(event) => setCopyCardId(event.target.value)}>
          <option value="">Selecione um card</option>
          {availableCards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.title} - {card.columnTitle}
            </option>
          ))}
        </select>
        <button type="button" className="ghost-button small-button" onClick={handleCopy}>
          Copiar card
        </button>
      </div>
    </div>
  );
}

function Card({ card, onDragStart }) {
  return (
    <article
      className="kanban-card"
      draggable
      onDragStart={(event) => onDragStart(event, card.id)}
    >
      <h3>{card.title}</h3>
      <dl>
        <div>
          <dt>Responsável</dt>
          <dd>{card.owner}</dd>
        </div>
        <div>
          <dt>Entrega</dt>
          <dd>{formatDate(card.dueDate)}</dd>
        </div>
      </dl>
      {card.comments ? <p>{card.comments}</p> : null}
    </article>
  );
}

function BoardScreen({ user, board, setBoard, alerts, setAlerts, onLogout }) {
  const [openColumnId, setOpenColumnId] = useState(null);

  const allCards = useMemo(
    () =>
      columns.flatMap((column) =>
        board[column.id].map((card) => ({
          ...card,
          columnId: column.id,
          columnTitle: column.title,
        })),
      ),
    [board],
  );

  function handleDragStart(event, cardId) {
    event.dataTransfer.setData("text/plain", cardId);
  }

  function moveCard(cardId, destinationColumnId) {
    const sourceColumn = columns.find((column) =>
      board[column.id].some((card) => card.id === cardId),
    );

    if (!sourceColumn || sourceColumn.id === destinationColumnId) return;

    const movedCard = board[sourceColumn.id].find((card) => card.id === cardId);
    if (!movedCard) return;

    setBoard((current) => ({
      ...current,
      [sourceColumn.id]: current[sourceColumn.id].filter((card) => card.id !== cardId),
      [destinationColumnId]: [...current[destinationColumnId], movedCard],
    }));
  }

  function handleDrop(event, columnId) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    moveCard(cardId, columnId);
  }

  function handleCreateCard(columnId, data) {
    const newCard = {
      id: `card-${crypto.randomUUID()}`,
      ...data,
    };

    setBoard((current) => ({
      ...current,
      [columnId]: [...current[columnId], newCard],
    }));
  }

  function handleCopyCard(targetColumnId, copiedCardId) {
    const sourceCard = allCards.find((card) => card.id === copiedCardId);
    if (!sourceCard) return;

    const clonedCard = {
      id: `card-${crypto.randomUUID()}`,
      title: `${sourceCard.title} (cópia)`,
      owner: sourceCard.owner,
      dueDate: sourceCard.dueDate,
      comments: sourceCard.comments,
    };

    setBoard((current) => ({
      ...current,
      [targetColumnId]: [...current[targetColumnId], clonedCard],
    }));
  }

  return (
    <main className="board-page">
      <header className="board-header">
        <div>
          <span className="brand-chip">Keikaku</span>
          <h1>Quadro Kanban</h1>
          <p>Bem-vindo, {user.name}. Organize o fluxo e acompanhe entregas próximas.</p>
        </div>
        <button type="button" className="ghost-button" onClick={onLogout}>
          Sair
        </button>
      </header>

      <section className="alerts-stack" aria-live="polite">
        {alerts.map((alert) => (
          <div key={alert.id} className="alert-popup">
            <span>{alert.message}</span>
            <button
              type="button"
              className="close-alert"
              onClick={() => setAlerts((current) => current.filter((item) => item.id !== alert.id))}
            >
              x
            </button>
          </div>
        ))}
      </section>

      <section className="board-grid">
        {columns.map((column) => (
          <div
            key={column.id}
            className="board-column"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDrop(event, column.id)}
          >
            <div className="column-header">
              <h2>{column.title}</h2>
              <button
                type="button"
                className="plus-button"
                onClick={() =>
                  setOpenColumnId((current) => (current === column.id ? null : column.id))
                }
              >
                +
              </button>
            </div>

            {openColumnId === column.id ? (
              <AddCardForm
                availableCards={allCards.filter((card) => card.columnId !== column.id)}
                onCreate={(data) => handleCreateCard(column.id, data)}
                onCopy={(cardId) => handleCopyCard(column.id, cardId)}
                onClose={() => setOpenColumnId(null)}
              />
            ) : null}

            <div className="cards-list">
              {board[column.id].map((card) => (
                <Card key={card.id} card={card} onDragStart={handleDragStart} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [board, setBoard] = useState(initialBoard);
  const [currentUser, setCurrentUser] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const loadedUsers = getStoredUsers();
    const loadedBoard = getStoredBoard();

    setUsers(loadedUsers);
    setBoard(loadedBoard);
  }, []);

  useEffect(() => {
    if (users.length) {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.board, JSON.stringify(board));
    if (currentUser) {
      setAlerts(buildAlerts(board));
    }
  }, [board, currentUser]);

  function handleLogin(user) {
    setCurrentUser(user);
    setAlerts(buildAlerts(board));
  }

  function handleRegister(newUser) {
    setUsers((current) => [...current, newUser]);
    setCurrentUser(newUser);
    setAlerts(buildAlerts(board));
  }

  function handleLogout() {
    setCurrentUser(null);
    setAlerts([]);
  }

  return currentUser ? (
    <BoardScreen
      user={currentUser}
      board={board}
      setBoard={setBoard}
      alerts={alerts}
      setAlerts={setAlerts}
      onLogout={handleLogout}
    />
  ) : (
    <LoginScreen onLogin={handleLogin} onRegister={handleRegister} users={users} />
  );
}
