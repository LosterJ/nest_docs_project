**Exception filters**

Nest comes with a built-in exceptions layer which is responsible for processing all unhandled exceptions across an app.
When an exception is not handled by your app code, it is caught by this layer, which then automatically sends an appropriate user-friendly response.

                                        |       Pipe
                                        |   Pipe    Pipe
            Client_Side       -------------------->      @Get() Route Handler
                              Filter    |
                            Filter      |

    Out of the box, this action is performed by a built-in global exception filter,
        which handles exceptions of type HttpException (and subclasses of it).
    When an exception is unrecognized (is neither HttpException nor a class that inherits form HttpException),
        the built-in exception filter generates the following default JSON response:
            {
                "statusCode": 500,
                "message": "Internal server error"
            }
    The global exception filter partially supports the http-errors library.
        Basically, any thrown exception containing the statusCode and message properties will be properly populated and sent back as a response
        (instead of the default InternalServerErrorException for unrecognized exceptions).