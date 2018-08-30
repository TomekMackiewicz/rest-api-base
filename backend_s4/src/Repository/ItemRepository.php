<?php

namespace App\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * ItemRepository
 *
 */
class ItemRepository extends EntityRepository
{       
    public function findOneByIdQuery(int $id)
    {
        $query = $this->_em->createQuery("SELECT i FROM App:Item i WHERE i.id = :id");
        $query->setParameter('id', $id);

        return $query;
    }

    public function findAllQuery()
    {
        return $this->_em->createQuery("SELECT i FROM App:Item i");
    }
    
}
