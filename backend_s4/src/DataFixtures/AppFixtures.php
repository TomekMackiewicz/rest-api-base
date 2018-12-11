<?php

namespace App\DataFixtures;

use App\Entity\Item;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        for ($i = 0; $i < 200; $i++) {
            $item = new Item();
            $item->setSignature('item '.$i);
            $item->setStatus(mt_rand(1, 9));
            $manager->persist($item);
        }

        $manager->flush();
    }
}
