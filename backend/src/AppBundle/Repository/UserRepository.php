<?php

namespace AppBundle\Repository;

/**
 * UserRepository
 */
class UserRepository extends \Doctrine\ORM\EntityRepository
{
    public function findOneByIdQuery(int $id)
    {
        $query = $this->_em->createQuery("SELECT u FROM AppBundle:User u WHERE u.id = :id");
        $query->setParameter('id', $id);

        return $query;
    }

    public function findAllQuery()
    {
        return $this->_em->createQuery("SELECT u FROM AppBundle:User u");
    }
    
}
