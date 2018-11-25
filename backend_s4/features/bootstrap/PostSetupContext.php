<?php

use App\Entity\Post;
use Behat\Behat\Context\Context;
use Behat\Behat\Context\SnippetAcceptingContext;
use Behat\Gherkin\Node\TableNode;
use Doctrine\ORM\EntityManagerInterface;

class PostSetupContext implements Context, SnippetAcceptingContext
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * PostSetupContext constructor.
     *
     * @param EntityManagerInterface $em
     */
    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * @Given there are posts with the following details:
     */
    public function thereArePostsWithTheFollowingDetails(TableNode $posts)
    {        
        foreach ($posts->getColumnsHash() as $val) {

            $post = new Post();

            $post->setTitle($val['title']);
            $post->setBody($val['body']);

            $this->em->persist($post);
            $this->em->flush();
        }
    }
}


