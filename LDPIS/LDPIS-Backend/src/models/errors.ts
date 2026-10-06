class InvalidArgumentError extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'InvalidArgumentError'
  }
}

class InternalServerError extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = 'InternalServerError'
  }
}

class InternalServerErrorMsg extends Error {
  constructor(error: any) {
    super(error.message)
    this.name = error?.message;
    this.message = error?.message?.replace(/ORA-+[0-9]+: /, "");
  }
}

class NotAuthorized extends Error {
  constructor() {
    const mensagem = 'Não foi possível acessar esse recurso'
    super(mensagem)
    this.name = 'NotAuthorized'
  }
}

class DBERROR extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = mensagem
  }
}

export default { InvalidArgumentError, InternalServerError, NotAuthorized, DBERROR, InternalServerErrorMsg }