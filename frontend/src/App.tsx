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
  TrashIcon,
} from "@heroicons/react/24/solid";

type Task = {
  task: string;
  description: string;
  isDescriptionVisible: boolean;
  replies: string[];
  deadline: string;
  agree: number;
  disagree: number;
  mentionedUsers: string[];
  creator: string;
};
const users = ["bot", "you"];

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      task: "布団乾燥機は必須",
      description: "@you 布団が乾くから",
      replies: [],
      deadline: new Date().toISOString().split("T")[0],
      isDescriptionVisible: false,
      agree: 10,
      disagree: 0,
      mentionedUsers: ["you"],
      creator: "bot",
    },
    {
      task: "GPUサーバのセットアップ",
      description: "@you サーバ室に新しいのが来た",
      replies: [],
      deadline: new Date().toISOString().split("T")[0],
      isDescriptionVisible: false,
      agree: 30,
      disagree: 0,
      mentionedUsers: ["you"],
      creator: "bot",
    },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [newTask, setNewTask] = useState<string>("");
  const [betAmount, setBetAmount] = useState<number>(0);
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const [addUsers, setAddUsers] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");
  const [userName, setUserName] = useState("you");
  const [userCoins, setUserCoins] = useState(100);
  const [deadline, setDeadline] = useState("");
  const [isBetDialogOpen, setIsBetDialogOpen] = useState<boolean>(false);
  const [betType, setBetType] = useState<string>("agree");
  const [betInd, setBetInd] = useState<number>(0);

  const addTask = () => {
    setUserName("you");
    if (newTask && betAmount > 0) {
      setTasks([
        ...tasks,
        {
          task: newTask,
          description: inputText,
          replies: [],
          deadline: new Date().toISOString().split("T")[0],
          isDescriptionVisible: false,
          agree: betAmount,
          disagree: 0,
          mentionedUsers: addUsers,
          creator: "you",
        },
      ]);
      setNewTask("");
      setUserCoins(userCoins - betAmount);
      setBetAmount(0);
      setInputText("");
      setAddUsers([]);
      setMentionedUsers([]);
      setIsDialogOpen(false);
      console.log("タスク:", newTask);
      console.log("メンション:", addUsers);
    }
  };

  const addReply = (index: number, reply: string) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].replies.push(`you:${reply}`);
    setTasks(updatedTasks);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    setInputText(value);
    if (value.includes("@")) {
      const mentionPart = value.split("@")[1];
      const filteredUsers = users.filter((user) =>
        user.toLowerCase().includes(mentionPart.toLowerCase())
      );
      setMentionedUsers(filteredUsers);
    } else {
      setMentionedUsers([]);
    }
  };

  const handleBet = (index: number, type: string, betAmount: number) => {
    const updatedTasks = [...tasks];
    if (type === "agree") {
      updatedTasks[index].agree += betAmount;
      setUserCoins(userCoins - betAmount);
    } else {
      updatedTasks[index].disagree += betAmount;
      setUserCoins(userCoins - betAmount);
    }
    setTasks(updatedTasks);
    setIsBetDialogOpen(false);
  };

  const judgeTask = (index: number, type: string) => {
    if (tasks[index].creator === "bot" && type === "agree") {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
      setUserCoins(userCoins + tasks[index].agree + tasks[index].disagree);
      setBetType("agree");
    } else {
      if (type === "agree") {
        setBetType("agree");
        setBetInd(index);
        setIsBetDialogOpen(true);
      } else {
        setBetType("disagree");
        setBetInd(index);
        setIsBetDialogOpen(true);
      }
    }
  };

  const handleUserSelect = (user: string) => {
    const newText = inputText.replace(/@\w*$/, `@${user} `);
    setInputText(newText);
    if (!mentionedUsers.includes(user)) {
      setMentionedUsers((prev) => [...prev, user]);
    }
    const pendingUsers = [...addUsers, user];
    setAddUsers(pendingUsers);
    console.log(pendingUsers);
    setMentionedUsers([]);
  };

  const toggleDescriptionVisibility = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isDescriptionVisible =
      !updatedTasks[index].isDescriptionVisible; // 表示状態を切り替え
    setTasks(updatedTasks);
  };

  const trashTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    setUserCoins(userCoins + tasks[index].agree + tasks[index].disagree);
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
              placeholder="補足説明（@でユーザーをメンション）"
              value={inputText}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full mb-4 border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            {mentionedUsers.length > 0 && (
              <ul className="bg-white border border-gray-300 rounded-md mt-2">
                {mentionedUsers.map((user, index) => (
                  <li
                    key={index}
                    onClick={() => handleUserSelect(user)}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
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
          {tasks.length > 0 ? (
            tasks.map((task, index) => {
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
                        {task.creator === "you" && (
                          <TrashIcon
                            className="h-5 w-5 text-red-600 mr-3 ml-auto"
                            onClick={() => trashTask(index)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>{task.deadline}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mt-2">
                      <InformationCircleIcon className="h-5 w-5 mr-2" />
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: task.isDescriptionVisible
                            ? "normal"
                            : "nowrap",
                          cursor: "pointer",
                        }}
                        onClick={() => toggleDescriptionVisibility(index)}
                      >
                        {task.isDescriptionVisible ||
                        task.description.length < 50
                          ? task.description
                          : `${task.description.slice(0, 50)}...`}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-green-500">
                          アリ ({task.agree})
                        </span>
                        <span className="text-sm font-medium text-red-500">
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
                        onClick={() => judgeTask(index, "agree")}
                        className="flex items-center justify-center text-xs px-3 py-1 bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                      >
                        <HandThumbUpIcon className="h-4 w-4 mr-1" /> アリ
                      </button>

                      <button
                        onClick={() => judgeTask(index, "disagree")}
                        className="flex items-center justify-center text-xs px-3 py-1 bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                      >
                        <HandThumbDownIcon className="h-4 w-4 mr-1" /> ナシ
                      </button>

                      {isBetDialogOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
                          <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4">
                              Bet数の決定{betInd}
                            </h2>
                            <div className="flex items-center mb-4">
                              <input
                                type="number"
                                placeholder="Betする通貨"
                                value={betAmount}
                                onChange={(e) =>
                                  setBetAmount(Number(e.target.value))
                                }
                                className="input input-bordered w-full border-blue-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                              />
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={userCoins}
                              value={betAmount}
                              onChange={(e) =>
                                setBetAmount(Number(e.target.value))
                              }
                              className="w-full mb-4"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => setIsBetDialogOpen(false)}
                                className="btn btn-outline"
                              >
                                キャンセル
                              </button>
                              <button
                                onClick={() =>
                                  handleBet(betInd, betType, betAmount)
                                }
                                className="btn btn-primary"
                              >
                                Bet!
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

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
                        className="input input-bordered w-full input-xs"
                      />
                      {task.replies.length > 0 && (
                        <ul className="menu bg-base-200 w-full rounded-box mt-2">
                          {task.replies.map((reply, rIndex) => (
                            <li key={rIndex}>
                              <a>{reply}</a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <span className="text-xl font-bold mb-4 text-center">
              決めたいことはありません
            </span>
          )}
        </ul>
      </div>
    </div>
  );
};

export default App;
