import express from 'express';
import {getUserByEmail} from '../db/users';
import {random, authentication} from '../helpers';
import {createUser} from '../db/users';



export const register = async (req: express.Request, res: express.Response) => {
  try {
    const {email, username, password} = req.body;

    if (!email || !username || !password) {
      return res.sendStatus(400);
    }
    
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password)
      },
    });

    return res.status(200).json(user).end();

  }
  catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}