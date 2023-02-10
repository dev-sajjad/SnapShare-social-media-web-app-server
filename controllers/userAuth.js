import jwt from 'jsonwebtoken';

export const userAuth = async(req, res) => {
   try {
     const user = req.body;
     const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "5h" });
     console.log(token);

     res.status(200).json({ token });
   } catch (error) {
       res.status(500).json({ message: error.message });
   }
}