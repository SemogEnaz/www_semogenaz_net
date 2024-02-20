import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const HUNTER_API_KEY = '3d0356141064fb9174b41263550e2194d51ee4d5';

type User = {
    userName: string,
    email: string,
    password: string
}

dotenv.config();
// https://sidorares.github.io/node-mysql2/docs
// https://www.youtube.com/watch?v=Hej48pi_lOc
const connection = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // TODO: For debugging remove later!!!
    if ( req.method == 'GET' ) {
        const [ results ] = await connection.query('SELECT * FROM users');
        res.status(200).json( results );
    };

    if (req.method != 'POST') 
        return res.status(405).end('Method not allowed');

    const { action } = req.query;
    const { userName, email, password } = req.body;
    const isUndefined = !action || !userName || !email || !password;

    if ( isUndefined )
        return res.status(400).end('Query error');

    const user = {
        userName: userName!,
        email: email!,
        password: password!
    };

    if (action == 'create') {
        await createUser( user ) ?
        res.status(201).json({ 
            message: `Account Created: ${user.email}` }) :
        res.status(500).end(
            `Account Creation Failed ${user.email}`);

    } else if (action == 'delete') {
        await deleteUser( user ) ?
        res.status(200).json({ 
            message: `Account Deleted ${user.email}` }) :
        res.status(500).end(
            `Account Deletion Failed ${user.email}`);

    } else if ( action == 'signIn' ) {
        await signInUser( user ) ?
        res.status(200).json({ 
            message: `Account Signed-In ${user.email}` }) :
        res.status(500).end(
            `Account Signed-In Failed ${user.email}`);
    }
}

const encrypt = async (data: string): Promise<string> => {

    // https://www.youtube.com/watch?v=Ud5xKCYQTjM
    try {
        const hashedData = await bcrypt.hash(data, 10);
        return hashedData;
    } catch {
        return '';
    }
}

const verifyEmail = async (userEmail: string): Promise<boolean> => {

    const api = `https://api.hunter.io/v2/email-verifier?email=${userEmail}&api_key=${HUNTER_API_KEY}`;
    const res = await fetch(api);

    return true;
}

const getUser = async (userEmail: string): Promise<User | undefined> => {
    const [ user ]: [User[]] = await connection.query(
        `select * from users where email = ? limit 1`,
        userEmail
    );

    return user.length > 0 ? user[0] : undefined;
};

const comparePwd = async (plainText: string, hash: string): Promise<boolean> => {
    try {
        if (await bcrypt.compare(plainText, hash)) 
            return true;
        return false;
    } catch {
        return false;
    }
}

/**
 * 
 * @param user User data from front end: name, email, plain text password
 * @returns boolean representing process success of failure of process
 */
async function createUser(user: User): Promise<boolean> {

    // Check if user account exists
    if (await getUser(user.email)) return false;

    // Verify email Syntax
    // https://stackoverflow.com/a/9204568
    const regex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
    if (!regex.test(user.email)) return false;

    // Verify email active?
    // if (!verifyEmail()) return false;

    // Encrypt password
    user.password = await encrypt(user.password)
    if (!user.password) return false;

    // Add user to db
    connection.query(
        `insert into users (userName, email, password)
        values (?, ?, ?)`,
        [user.userName, user.email, user.password]
    );

    return true;
}

async function deleteUser(user: User): Promise<boolean> {

    const userInDB = await getUser(user.email);
    if (!userInDB) return false;

    if (!comparePwd(
        user.password, userInDB.password )) return false;

    connection.query(
        'delete from users where email = ?',
        user.email
    );

    return true;
}

async function signInUser(user: User): Promise<boolean> {

    const userInDb = await getUser(user.email);
    if (!userInDb) return false;

    return comparePwd(
        user.password, userInDb.password
    );
}