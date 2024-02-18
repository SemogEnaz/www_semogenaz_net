import { NextApiRequest, NextApiResponse } from "next";

export function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method != 'POST') res.status(405).end('Method not allowed')

    const { action } = req.query;

    if (action == 'create') {
        createUser() ?
        res.status(201).json({ message: 'User Account Created' }) :
        res.status(500).end('Account Creation Failed');
        
    } else if (action == 'delete') {
        deleteUser() ?
        res.status(204).json({ message: 'User Account Deleted' }) :
        res.status(500).end('Account Deletion Failed');
    }

    res.status(400).end('Query error');
}

function createUser(): boolean {
    return true;
}

function deleteUser(): boolean {
    return true;
}