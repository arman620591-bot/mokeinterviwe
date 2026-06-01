import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import UserAnswer from '@/models/UserAnswer';

export async function POST(request) {
    try {
        const { userEmail } = await request.json();

        if (!userEmail) {
            return NextResponse.json({ message: 'User email is required' }, { status: 400 });
        }

        await connectToDatabase();

        const userAnswers = await UserAnswer.find({ userEmail }).sort({
            createdAt: -1,
            _id: -1,
        });

        return NextResponse.json({ 
            userAnswers: userAnswers.length > 0 ? userAnswers : [] 
        }, { status: 200 });

    } catch(err) {
        console.error('Fetch error:', err);
        return NextResponse.json({ 
            message: 'Internal server error', 
            error: err.message 
        }, { status: 500 });
    }
}