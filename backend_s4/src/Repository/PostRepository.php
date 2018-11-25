<?php

namespace App\Repository;

use Doctrine\ORM\EntityRepository;

class PostRepository extends EntityRepository
{       
    public function findOneById(int $id)
    {
        $query = $this->_em->createQuery("SELECT p FROM App:Post p WHERE p.id = :id");
        $query->setParameter('id', $id);

        return $query;
    }

    public function findAll()
    {
        return $this->_em->createQuery("SELECT p FROM App:Post p");
    }
    
}

