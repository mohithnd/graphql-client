import { useQuery, gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import MyError from "./MyError";
import { useState } from "react";

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      username
      email
      phone
      website
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      username
      email
      phone
      website
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      name
      username
      email
      phone
      website
    }
  }
`;

interface CreateUserInput {
  id?: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

interface UpdateUserInput {
  id: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
}

const AllUsersPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_USERS);
  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      console.log("User deleted successfully!");
      setDeletingUserId(null);
      refetch();
    },
    onError: (err) => {
      console.error("Error deleting user:", err);
      setDeletingUserId(null);
      alert(`Error deleting user: ${err.message}`);
    },
  });
  const [createUser, { loading: creating, error: createError }] = useMutation(
    CREATE_USER,
    {
      onCompleted: () => {
        console.log("User created successfully!");
        setIsCreating(false);
        setNewUser({
          name: "",
          username: "",
          email: "",
          phone: "",
          website: "",
        });
        refetch();
      },
      onError: (err) => {
        console.error("Error creating user:", err);
        alert(`Error creating user: ${err.message}`);
      },
    }
  );
  const [updateUser, { loading: updating, error: updateError }] = useMutation(
    UPDATE_USER,
    {
      onCompleted: () => {
        console.log("User updated successfully!");
        setEditingUserId(null);
        refetch();
      },
      onError: (err) => {
        console.error("Error updating user:", err);
        alert(`Error updating user: ${err.message}`);
      },
    }
  );

  const [isCreating, setIsCreating] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<CreateUserInput>({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
  });
  const [updatedUser, setUpdatedUser] = useState<UpdateUserInput>({
    id: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
  });

  if (loading) return <Loading />;
  if (error) return <MyError message={error.message} />;
  if (createError) return <MyError message={createError.message} />;
  if (updateError) return <MyError message={updateError.message} />;

  const handleDeleteUser = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setDeletingUserId(id);
      deleteUser({ variables: { id } });
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({
      variables: {
        input: { ...newUser, id: Math.floor(Math.random() * 90000) + 10000 },
      },
    });
  };

  const handleStartEditing = (user: any) => {
    setEditingUserId(user.id);
    setUpdatedUser({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      website: user.website,
    });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ variables: { input: updatedUser } });
  };

  const handleCancelEditing = () => {
    setEditingUserId(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-teal-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center">
      <div className="w-full max-w-lg mb-6">
        <h2 className="text-3xl font-bold text-teal-200 shadow-md flex items-center justify-between py-2">
          <span className="text-teal-300">All</span> Users
          <button
            onClick={() => setIsCreating(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
          >
            Create New User
          </button>
        </h2>
      </div>

      {isCreating && (
        <div className="bg-gray-700 rounded-lg p-6 shadow-lg border border-green-700 w-full max-w-lg mb-6">
          <h3 className="text-xl font-semibold text-green-300 mb-4">
            Create New User
          </h3>
          <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newUser.phone}
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <input
              type="url"
              placeholder="Website"
              value={newUser.website}
              onChange={(e) =>
                setNewUser({ ...newUser, website: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
                disabled={creating || updating}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ul className="list-none p-4 m-0 bg-gray-800 rounded-lg shadow-lg border border-teal-700 w-full max-w-lg">
        {data?.getAllUsers?.map((user: any) => (
          <li
            key={user.id}
            className="mb-4 p-4 rounded-md bg-gray-700 shadow-sm hover:shadow-md transition duration-200 ease-in-out"
          >
            {editingUserId === user.id ? (
              <div className="bg-gray-600 rounded-lg p-4 mb-2">
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                  Editing User
                </h3>
                <form
                  onSubmit={handleUpdateUser}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={updatedUser.name}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, name: e.target.value })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={updatedUser.username}
                    onChange={(e) =>
                      setUpdatedUser({
                        ...updatedUser,
                        username: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={updatedUser.email}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, email: e.target.value })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={updatedUser.phone}
                    onChange={(e) =>
                      setUpdatedUser({ ...updatedUser, phone: e.target.value })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Website"
                    value={updatedUser.website}
                    onChange={(e) =>
                      setUpdatedUser({
                        ...updatedUser,
                        website: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
                      disabled={updating}
                    >
                      {updating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/user/${user.id}`}
                    className="block text-white no-underline hover:text-teal-200"
                  >
                    <h3 className="text-xl font-semibold text-cyan-300 mb-1">
                      {user.name}
                    </h3>
                    <p className="text-gray-300 mb-1">
                      Username:{" "}
                      <span className="text-yellow-300">{user.username}</span>
                    </p>
                    <p className="text-gray-300">
                      Email:{" "}
                      <span className="text-purple-300">{user.email}</span>
                    </p>
                  </Link>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEditing(user)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-md shadow-sm transition duration-200 ease-in-out"
                    disabled={
                      creating || updating || deletingUserId === user.id
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md shadow-sm transition duration-200 ease-in-out"
                    disabled={
                      creating || updating || deletingUserId === user.id
                    }
                  >
                    {deletingUserId === user.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsersPage;
