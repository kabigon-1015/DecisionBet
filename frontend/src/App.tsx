import { useState } from "react";
import "./index.css"; // Tailwind CSSを適用するためにインポート
import {
  PlusIcon,
  UserIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";

type Task = {
  task: string;
  bet: number;
  description: string;
  replies: string[];
  deadline: string;
};
const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>("");
  const [betAmount, setBetAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [userName, setUserName] = useState("kabigon");
  const [userCoins, setUserCoins] = useState(100);
  const [deadline, setDeadline] = useState("");

  const addTask = () => {
    if (newTask && betAmount > 0) {
      setTasks([
        ...tasks,
        {
          task: newTask,
          bet: betAmount,
          description,
          replies: [],
          deadline: new Date().toISOString().split("T")[0],
        },
      ]);
      setNewTask("");
      setBetAmount(0);
      setDescription("");
      setIsDialogOpen(false);
    }
  };

  const addReply = (index: number, reply: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].replies.push(reply);
    setTasks(updatedTasks);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md p-4 mb-6 fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Decision Coin</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 text-yellow-500 mr-1" />
              <span className="font-semibold">{userCoins}</span>
            </div>
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-600 mr-1" />
              <span>{userName}</span>
            </div>
          </div>
        </div>
      </header>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">新しい決め事を追加</h2>
            <input
              type="text"
              placeholder="決め事を入力"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="input input-bordered w-full mb-4 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <div className="flex items-center mb-4">
              <input
                type="number"
                placeholder="Betする通貨"
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="input input-bordered w-full border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
              <button
                onClick={() => setBetAmount(betAmount + 10)}
                className="ml-2 btn btn-secondary"
              >
                +10
              </button>
            </div>
            <input
              type="range"
              min={0}
              max={userCoins}
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full mb-4"
            />
            <textarea
              placeholder="補足説明"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full mb-4 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="input input-bordered w-full mb-4 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="btn btn-outline"
              >
                キャンセル
              </button>
              <button onClick={addTask} className="btn btn-primary">
                追加
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="pt-20 px-4">
        <ul className="space-y-4">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="card bg-white shadow-lg rounded-lg border border-gray-200 p-4"
            >
              <div className="card-body">
                <h3 className="card-title text-lg font-semibold text-gray-800">
                  {task.task}
                </h3>
                <p className="text-gray-600">Bet: {task.bet} 通貨</p>
                <p className="text-gray-600">説明: {task.description}</p>
                <p className="text-gray-600">期限: {task.deadline}</p>
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="返信を入力"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const target = e.target as HTMLInputElement;
                        addReply(index, target.value);
                        target.value = "";
                      }
                    }}
                    className="input input-bordered w-full"
                  />
                  <ul className="menu bg-base-200 w-full rounded-box mt-2">
                    {task.replies.map((reply, rIndex) => (
                      <li key={rIndex}>
                        <a>{reply}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
