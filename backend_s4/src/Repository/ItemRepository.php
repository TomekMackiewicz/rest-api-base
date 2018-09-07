<?php

namespace App\Repository;

use Doctrine\ORM\EntityRepository;

/**
 * ItemRepository
 *
 */
class ItemRepository extends EntityRepository
{       
    public function findOneById(int $id)
    {
        $query = $this->_em->createQuery("SELECT i FROM App:Item i WHERE i.id = :id");
        $query->setParameter('id', $id);

        return $query;
    }

    public function findAll()
    {
        return $this->_em->createQuery("SELECT i FROM App:Item i");
    }
    
}
