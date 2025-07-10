import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import 'dotenv/config'
import methodOverride from 'method-override'

const app = express()
const port = process.env.PORT

app.use(express.urlencoded())
app.use(morgan('dev'))
app.use(express.static('public'));
app.use(methodOverride('_method'))

const movieSchema = new mongoose.Schema({
    title:{type: String, required: true},
    director: String,
    releaseYear: Number,
    genre: String,
    rating: {type: Number, min:0, max: 100}
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

app.get('/movies/:movieId/edit', async (req,res)=>{
    const{movieId} = req.params
    const movie = await Movie.findById(movieId)
    return res.render('edit.ejs', {movie})
})

app.put('/movies/:movieId', async (req, res)=>{
    try {
        const {movieId} = req.params
        await Movie.findByIdAndUpdate(movieId, req.body)
        return `/movies/${movieId}`
    } catch (error) {
        console.log("update error")
    }
})



app.post('/movies', async (req, res) =>{
    try{
        const newMovie = await Movie.create(req.body)
        return res.redirect(`/movies/${newMovie._id}`)
    }catch(e){
        console.error('❌ Error creating movie:', e);
        res.status(500).send('Server error');
    }
})

app.delete('/movies/:movieId', async (req,res)=>{
try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId)
    console.log(`Deleted ${deletedMovie.title}`)
    return res.redirect('/movies')
} catch (error) {
    console.log("delete error")
}
})




const connect = async() =>{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('connected to MongoDB')
}
connect()



app.listen(port, ()=> console.log(`🚀 Server up and running on port ${port}`))