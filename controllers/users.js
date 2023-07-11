import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;

        // first find the user
        const user = await User.findById(id);

        // here promise as multiple api calls being done
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // formatted so that info is pretty clear in front end
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        // get both user and his friend id
        const { id, friendId } = req.params;
        console.log(id, friendId);

        // here we get user
        const user = await User.findById(id);

        // here we get friend
        const friend = await User.findById(friendId);

        // if friend is already his friend then remove it
        // as the button is we add or remove..bot func in single button
        if (user.friends.includes(friendId)) {

            // here the friend is removed and rest is saved in that
            user.friends = user.friends.filter((id) => id !== friendId);

            // same done for friend
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            // both of get friends
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        // save the model
        await user.save();
        await friend.save();

        // we again make the fried list with the update
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // we again make formatted friend list
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
