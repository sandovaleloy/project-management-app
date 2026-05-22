import jwt from "jsonwebtoken"

export function verifyToken(token: string) {

  console.log("TOKEN RECIBIDO:", token)

  if (!token || token === "null" || token === "undefined") {
    throw new Error("Token inválido")
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    )

    console.log("TOKEN DECODIFICADO:", decoded)

    return decoded as any

  } catch (error) {

    console.log("ERROR JWT:", error)

    throw new Error("JWT inválido")

  }

}