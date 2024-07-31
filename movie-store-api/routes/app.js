const Movie = require('./models/movie');

// Create a new movie
app.post('/movies', async (req, res) => {
    try {
        const movie = new Movie(req.body);
        await movie.save();
        res.status(201).send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all movies with filtering, sorting, and pagination
app.get('/movies', async (req, res) => {
    try {
        const { q, rating, sortBy, page = 1, limit = 10 } = req.query;

        let query = {};
        if (q) {
            query.title = new RegExp(q, 'i');
        }
        if (rating) {
            query.rating = rating;
        }

        let sort = {};
        if (sortBy) {
            sort[sortBy] = 1; // Ascending order
        }

        const movies = await Movie.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).send(movies);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get a single movie by ID
app.get('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.status(200).send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update a movie
app.put('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.status(200).send(movie);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).send('Movie not found');
        }
        res.status(200).send('Movie deleted');
    } catch (error) {
        res.status(400).send(error);
    }
});
