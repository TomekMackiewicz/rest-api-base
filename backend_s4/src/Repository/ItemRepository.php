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
    
    public function findPaginated($limit, $sort, $order, $offset)
    {
        $qb = $this->_em->createQueryBuilder();
        $qb->select('i')
            ->from('App:Item', 'i')
            ->orderBy('i.'.$sort, $order)
            ->setMaxResults($limit)
            ->setFirstResult($offset);

        return $qb->getQuery();
    }

    public function countItems()
    {
        return $this->_em->createQuery("SELECT COUNT(i) FROM App:Item i");
    }    
}
