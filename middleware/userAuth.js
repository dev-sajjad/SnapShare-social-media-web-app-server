import jwt from 'jsonwebtoken';

 const userAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
       return res.status(401).json({ message: 'Unauthorized access!' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Unauthorized access!' });
        }

        req.decoded = decoded;
        next();
    })  
}

export default userAuth;