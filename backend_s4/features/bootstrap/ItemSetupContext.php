<?php

use App\Entity\Item;
use Behat\Behat\Context\Context;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\Gherkin\Node\TableNode;
use Doctrine\ORM\EntityManagerInterface;

class ItemSetupContext implements Context, SnippetAcceptingContext
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * ItemSetupContext constructor.
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Given there are Items with the following details:
     */
    public function thereAreItemsWithTheFollowingDetails(TableNode $items)
    {        
        foreach ($items->getColumnsHash() as $val) {

            $item = new Item();

            $item->setSignature($val['signature']);
            $item->setStatus($val['status']);

            $this->em->persist($item);
            $this->em->flush();
        }
    }
}


