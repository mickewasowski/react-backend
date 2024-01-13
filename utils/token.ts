import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export const generateToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET as string, { //, peterpost: 'true'
    expiresIn: "30d",
  });
  return token;
}


export const verifyToken = (token: string): {succes: boolean, payload?: JwtPayload} => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
    return {succes: true, payload: decoded}
  } catch (e){
      console.log({e})    
      return {succes: false}
  }
}