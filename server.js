import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import 'dotenv/config'

const app = express()
const port = process.env.PORT

app.use(express.urlencoded())
app.use(morgan('dev'))

const movieSchema = new mongoose.Schema({
    title:{type: String, required: true},
    director: String,
    releaseYear: Number,
    genre: String,
    rating: {type: Number, min:0, max: 10}
})

const Movie = mongoose.model('Movie', movieSchema)

app.get('/movies', async (req,res)=>{
    const movies = await Movie.find()
    return res.render ('index.ejs', {allMovies: movies})
})

app.get('/movies/new', (req,res) =>{
    return res.render('new.ejs')
})

app.get('/movies/:movieId', async (req,res) =>{
    const {movieId} = req.params
    const movie = await Movie.findById(movieId)
    return res.render('show.ejs', {movie})
})



app.post('/movies', async (req, res) =>{
    try{
        const newMovie = await Movie.create(req.body)
        return res.redirect(`/movies/${newMovie._id}`)
    }catch(e){
        console.log('error')
    }
})




const connect = async() =>{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to MongoDB')
}
connect()



app.listen(port, ()=> console.log(`🚀 Server up and running on port ${port}`))