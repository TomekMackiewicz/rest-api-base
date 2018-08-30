<?php

namespace App\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * UserRepository
 */
class UserRepository extends EntityRepository
{       
    public function findOneByIdQuery(int $id)
    {
        $query = $this->_em->createQuery("SELECT u FROM App:User u WHERE u.id = :id");
        $query->setParameter('id', $id);

        return $query;
    }

    public function findAllQuery()
    {
        return $this->_em->createQuery("SELECT u FROM App:User u");
    }
    
}
