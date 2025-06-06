/* eslint-disable @typescript-eslint/no-explicit-any */
type Token = { token: string } | null

type Resolver = {
  resolve: (token: Token) => void
  reject: (reason?: any) => void
}

export class TokenRequestManager {
  private token: Token = null
  private isFetching = false
  private resolvers: Resolver[] = []

  constructor(private fetchFn: () => Promise<Token>) {}

  public async getToken(): Promise<Token> {
    if (this.token) {
      return this.token
    }

    if (this.isFetching) {
      return new Promise<Token>((resolve, reject) => {
        this.resolvers.push({ resolve, reject })
      })
    }

    this.isFetching = true

    try {
      const token = await this.fetchFn()
      this.token = token
      this.resolveAll(token)
      return token
    } catch (err) {
      this.rejectAll(err)
      throw err
    } finally {
      this.resolvers = []
      this.isFetching = false
      this.clearToken()
    }
  }

  public clearToken() {
    this.token = null
  }

  private resolveAll(token: Token) {
    for (const { resolve } of this.resolvers) {
      resolve(token)
    }
  }

  private rejectAll(error: any) {
    for (const { reject } of this.resolvers) {
      reject(error)
    }
  }
}
