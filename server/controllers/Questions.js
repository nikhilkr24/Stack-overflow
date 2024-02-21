import mongoose from "mongoose"
import Questions from '../models/Questions.js'

export const AskQuestion = async (req, res) => {
    const postQuestionData = req.body;
    const postQuestion = new Questions(postQuestionData)
    try {
        await postQuestion.save();
        res.status(200).json("Posted a questiuon successfully")
    } catch (error) {
        console.log(error)
        res.status(409).json("Could't post a new question")
    }
}

export const getAllQuestions = async (req, res) => {
    try {
        const questionList = await Questions.find();
        res.status(200).json(questionList);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const deleteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...')
    }

    try {
        await Questions.findByIdAndDelete(_id);
        res.status(200).json({ message: "Successfully Deleted..." });
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const voteQuestion = async (req, res) => {
    const { id: _id } = req.params;
    const { value, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('question unavailable...')
    }

    try {
        const question = await Questions.findById(_id);
        if (!question) {
            return res.status(404).send('question not found...')
        }

        if (question.upVote === userId || question.downVote === userId) {
            return res.status(404).json({ message: "You have already voted for this question" })
        }

        if (value === 'upVote') {
            question.upVote += 1;
            question.upVote = userId
        }
        else if (value === 'downVote') {
            question.downVote += 1
            question.downVote = userId
        }
        else {
            res.status(400).send('Invalid Vote Value');
        }
        // await Questions.save();
        await Questions.findByIdAndUpdate(_id, question)
        // res.status(200).json({ message: 'voted successfully' })
        res.json(question)
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: "id not found" })
    }
}
