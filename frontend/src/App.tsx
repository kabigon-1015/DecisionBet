import { useState } from "react";
import "./index.css"; // Tailwind CSSを適用するためにインポート
import {
  PlusIcon,
  UserIcon,
  CurrencyDollarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  InformationCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/solid";

type Task = {
  task: string;
  description: string;
  replies: string[];
  deadline: string;
  agree: number;
  disagree: number;
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
  setUserName("kabigon");

  const addTask = () => {
    if (newTask && betAmount > 0) {
      setTasks([
        ...tasks,
        {
          task: newTask,
          description,
          replies: [],
          deadline: new Date().toISOString().split("T")[0],
          agree: betAmount,
          disagree: 0,
        },
      ]);
      setNewTask("");
      setUserCoins(userCoins - betAmount);
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

  const handleBet = (index: number, type: string) => {
    const updatedTasks = [...tasks];
    if (type === "agree") {
      updatedTasks[index].agree += 1;
      setUserCoins(userCoins - 1);
    } else {
      updatedTasks[index].disagree += 1;
      setUserCoins(userCoins - 1);
    }
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
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 z-50"
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
      <div className="pt-20 px-4 z-0">
        <ul className="space-y-4">
          {tasks.map((task, index) => {
            const totalVotes = task.agree + task.disagree;
            const agreePercentage =
              totalVotes > 0 ? (task.agree / totalVotes) * 100 : 0;

            return (
              <li
                key={index}
                className="card bg-white shadow-lg rounded-lg border border-gray-200 p-4"
              >
                <div className="card-body">
                  <div className="flex items-center text-gray-600 mt-1 text-sm space-x-4">
                    <div className="flex items-center">
                      <h3 className="card-title text-lg font-semibold text-gray-800">
                        {task.task}
                      </h3>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{task.deadline}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mt-2">
                    <InformationCircleIcon className="h-5 w-5 mr-2" />
                    <span>{task.description}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-green-700">
                        アリ ({task.agree})
                      </span>
                      <span className="text-sm font-medium text-red-700">
                        ナシ ({task.disagree})
                      </span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2.5 relative">
                      <div
                        className="bg-green-600 h-2.5 rounded-l-full absolute left-0 top-0"
                        style={{ width: `${agreePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <button
                      onClick={() => handleBet(index, "agree")}
                      className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                    >
                      <HandThumbUpIcon className="h-5 w-5 mr-1" /> アリ
                    </button>
                    <button
                      onClick={() => handleBet(index, "disagree")}
                      className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                    >
                      <HandThumbDownIcon className="h-5 w-5 mr-1" /> ナシ
                    </button>
                  </div>
                  {/* 返信入力フィールド */}
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
                    {/* 返信リスト */}
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
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default App;
