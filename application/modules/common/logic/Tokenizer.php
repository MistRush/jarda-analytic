<?php

namespace common\logic;

use common\logic\Configs;
use MiladRahimi\Jwt\Cryptography\Algorithms\Hmac\HS256;
use MiladRahimi\Jwt\Cryptography\Keys\HmacKey as Hmac;
use MiladRahimi\Jwt\Exceptions\InvalidSignatureException;
use MiladRahimi\Jwt\Exceptions\InvalidTokenException;
use MiladRahimi\Jwt\Exceptions\JsonDecodingException;
use MiladRahimi\Jwt\Exceptions\SigningException;
use MiladRahimi\Jwt\Exceptions\ValidationException;
use MiladRahimi\Jwt\Generator;
use MiladRahimi\Jwt\Parser;

class Tokenizer {

    /**
     * @throws \Exception
     */
    public static function generateToken(array $data): string
    {
        $tokenKey = new Hmac(Configs::getTokenizerTokenSecret());
        $tokenSigner = new HS256($tokenKey);
        $generator = new Generator($tokenSigner);

        return $generator->generate($data);

    }


    /**
     * @throws InvalidTokenException
     * @throws SigningException
     * @throws ValidationException
     * @throws InvalidSignatureException
     * @throws JsonDecodingException
     * @throws \Exception
     */
    public static function parseToken(string $token): array
    {
        $tokenKey = new Hmac(Configs::getTokenizerTokenSecret());
        $tokenSigner = new HS256($tokenKey);
        $parser = new Parser($tokenSigner);

        return $parser->parse($token);

    }
}