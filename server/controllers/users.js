import User from "../models/User";

/* READ */

export const getUser = async (req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    } catch (err) {
        res.status(404).json({message: err.message}) 
    }
};

export const getUserFriends = async(req, res) => {
    try{
        const {id} = req.params;
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupaction, location, picturePath}) => {
            return { _id, firstName, lastName, occupaction, location, picturePath};
            }
            );

    } catch (err){
        res.status(400).json({messagE: err.message});
    }
}

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try{
        const {id, friendId} = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        /* chceck if friend is already in user's friends list */
        const isFriend = user.friends.includes(friendId);
        if(!isFriend){
            user.friends.push(friendId);
            friend.friends.push(id);
        } else {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } 
        await user.save();
        await friend.save(); 

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupaction, location, picturePath}) => {
            return { _id, firstName, lastName, occupaction, location, picturePath};
            }
        );

        res.status(200).json(formattedFriends); 

    }catch(err){
        res.status(400).json({messagE: err.message});
    }
}

